const { GoogleGenerativeAI } = require('@google/generative-ai');
const Solution = require('../models/Solution');
const User = require('../models/User');

// ── Initialize Gemini
let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return null;
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    });
  }
  return model;
}

// ── Build system context for Gemini
const SYSTEM_PROMPT = `You are MediAid AI, an expert clinical first aid assistant embedded in the MediAid platform. You provide accurate, structured, step-by-step first aid guidance.

RESPONSE RULES:
1. Always respond in the SAME LANGUAGE the user writes in (English, Urdu, Hindi, Arabic, French, Spanish, etc.)
2. Structure responses with clear numbered steps when giving protocols
3. Always mention when to call emergency services (critical situations)
4. Include what NOT to do (common mistakes)
5. Be concise but complete — not more than 400 words
6. End with a disclaimer: "⚠️ This is first aid guidance only. Seek professional medical care for serious conditions."
7. If asked something NOT related to medical/health/first aid, politely redirect: "I specialize in first aid and health emergencies. Please ask me about medical situations."
8. Never give dosage recommendations for prescription medications
9. Always prioritize calling emergency services for life-threatening situations

FORMAT your response as:
🩺 **[Condition Name]**
**Severity:** [Critical/Moderate/Mild]

**Immediate Steps:**
1. [Step]
2. [Step]
...

**❌ Do NOT:**
- [Common mistake]

**🚨 Call Emergency If:** [Condition]

⚠️ This is first aid guidance only. Seek professional medical care for serious conditions.`;

// ─── Helper: extract condition keywords from user message
function extractConditionKeywords(message) {
  const keywords = {
    burn: ['burn', 'fire', 'hot', 'scald', 'flame', 'جلنا', 'آگ', 'जलना'],
    cpr: ['cpr', 'cardiac', 'heart attack', 'chest', 'not breathing', 'دل', 'cardiac arrest', 'हृदय'],
    choking: ['chok', 'swallow', 'airway', 'breathe', 'heimlich', 'دم گھٹنا', 'साँस'],
    wound: ['bleed', 'cut', 'wound', 'blood', 'gash', 'خون', 'زخم', 'खून'],
    snake: ['snake', 'venom', 'bite', 'سانپ', 'سانپ کاٹنا', 'सांप'],
    seizure: ['seizure', 'epilepsy', 'convuls', 'fit', 'دورہ', 'مرگی', 'दौरा'],
    fracture: ['fracture', 'broken bone', 'break', 'ٹوٹی ہڈی', 'फ्रैक्चर'],
    fever: ['fever', 'temperature', 'hot forehead', 'بخار', 'بुخار', 'बुखार'],
    allergic: ['allergy', 'anaphylax', 'swelling', 'allergic', 'الرجی', 'एलर्जी'],
    drowning: ['drown', 'water', 'submerge', 'ڈوبنا', 'डूबना'],
    stroke: ['stroke', 'paralysis', 'facial droop', 'فالج', 'स्ट्रोक'],
  };

  const lowerMsg = message.toLowerCase();
  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(w => lowerMsg.includes(w))) return key;
  }
  return null;
}

// ══════════════════════════════════════════
// @route   POST /api/chat
// @access  Public (but logs to user if authenticated)
// ══════════════════════════════════════════
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [], language = 'en' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, message: 'Message too long. Max 1000 characters.' });
    }

    // ── 1. Look for verified solutions from DB matching this query
    const conditionKey = extractConditionKeywords(message);
    let verifiedSolutions = [];

    if (conditionKey) {
      verifiedSolutions = await Solution.find({
        conditionKey,
        status: 'approved',
      })
        .sort({ isFeatured: -1, likesCount: -1, views: -1 })
        .limit(3)
        .select('title mediaType externalUrl fileUrl condition source views likesCount authorName duration')
        .lean();
    }

    // ── 2. Call Gemini AI
    const aiModel = getModel();
    let aiResponse = null;
    let usedFallback = false;

    if (aiModel) {
      try {
        // Build conversation history for context
        const chatHistory = history
          .slice(-6) // last 3 exchanges = 6 messages
          .map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          }));

        const chat = aiModel.startChat({
          history: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood. I am MediAid AI, ready to provide accurate first aid guidance in any language.' }] },
            ...chatHistory,
          ],
        });

        const result = await chat.sendMessage(message);
        aiResponse = result.response.text();
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError.message);
        usedFallback = true;
      }
    } else {
      usedFallback = true;
    }

    // ── 3. Fallback response if Gemini unavailable
    if (usedFallback || !aiResponse) {
      aiResponse = generateFallbackResponse(message, conditionKey, language);
    }

    // ── 4. Log query to user activity if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { queriesCount: 1 },
        lastQuery: message.slice(0, 200),
        $push: {
          activityLog: {
            $each: [{ action: 'query', detail: `Asked: "${message.slice(0, 80)}"`, timestamp: new Date() }],
            $position: 0,
            $slice: 20,
          },
        },
      });
    }

    // ── 5. Build Chat Log entry
    const chatLog = await ChatLog.create({
      user: req.user?._id || null,
      message: message.slice(0, 500),
      response: aiResponse.slice(0, 2000),
      conditionKey,
      language,
      usedAI: !usedFallback,
      matchedSolutions: verifiedSolutions.map(s => s._id),
    }).catch(() => null); // Non-blocking — don't fail if logging fails

    res.json({
      success: true,
      response: aiResponse,
      conditionKey,
      verifiedSolutions,
      usedAI: !usedFallback,
      suggestedQueries: getSuggestedQueries(conditionKey, language),
    });

  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/chat/history
// @access  Private
// ══════════════════════════════════════════
exports.getChatHistory = async (req, res, next) => {
  try {
    const logs = await ChatLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('matchedSolutions', 'title mediaType condition');

    res.json({ success: true, history: logs });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/chat/status
// @access  Public — check if AI is available
// ══════════════════════════════════════════
exports.getStatus = (req, res) => {
  const hasGemini = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    success: true,
    ai: {
      available: hasGemini,
      model: hasGemini ? 'gemini-1.5-flash' : 'rule-based-fallback',
      provider: hasGemini ? 'Google Gemini AI' : 'Local Knowledge Base',
    },
  });
};

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function generateFallbackResponse(message, conditionKey, language) {
  const fallbacks = {
    burn: `🩺 **Burns First Aid**\n**Severity:** Varies\n\n**Immediate Steps:**\n1. Cool the burn under cool (not cold) running water for 20 minutes immediately.\n2. Remove jewelry/clothing near the burn area — unless stuck to skin.\n3. Cover loosely with sterile non-fluffy dressing or clean film.\n4. Do NOT use ice, butter, toothpaste or any cream.\n\n**🚨 Call Emergency If:** Burn is larger than palm size, on face/hands/genitals, chemical/electrical burn, or deep burn.\n\n⚠️ This is first aid guidance only. Seek professional medical care for serious conditions.`,
    cpr: `🩺 **Cardiac Arrest / CPR**\n**Severity:** Critical\n\n**Immediate Steps:**\n1. Check scene safety. Tap shoulders: "Are you OK?"\n2. Call emergency services immediately (911/112/1122).\n3. Place heel of one hand on center of chest, interlock other hand.\n4. Push hard and fast: 2 inches deep, 100-120 compressions per minute.\n5. Continue until AED arrives or emergency services take over.\n\n**❌ Do NOT:** Delay starting CPR. Don't stop unless exhausted or help arrives.\n\n**🚨 Call Emergency If:** Person is unresponsive and not breathing normally.\n\n⚠️ This is first aid guidance only. Seek professional medical care for serious conditions.`,
    choking: `🩺 **Choking First Aid**\n**Severity:** Critical\n\n**Immediate Steps:**\n1. Ask: "Are you choking?" If they can't speak or breathe, act now.\n2. Give 5 firm back blows between shoulder blades with heel of hand.\n3. Give 5 abdominal thrusts (Heimlich): fist above navel, sharp inward/upward thrust.\n4. Alternate 5 back blows + 5 thrusts until object is expelled.\n5. If person goes unconscious: call emergency services and start CPR.\n\n**🚨 Call Emergency If:** Object not removed after 5 cycles or person loses consciousness.\n\n⚠️ This is first aid guidance only. Seek professional medical care for serious conditions.`,
    wound: `🩺 **Wound / Bleeding First Aid**\n**Severity:** Moderate-Critical\n\n**Immediate Steps:**\n1. Apply direct firm pressure with clean cloth for at least 10 minutes. Do not remove cloth.\n2. Elevate injured area above heart level if possible.\n3. If cloth soaks through, add more cloth on top — do not remove.\n4. Once bleeding controlled, clean gently with clean water.\n5. Cover with sterile dressing.\n\n**❌ Do NOT:** Remove embedded objects. Don't use tourniquet unless limb-threatening.\n\n**🚨 Call Emergency If:** Bleeding won't stop after 15 minutes, spurting blood, deep wound, or wound on head/chest/abdomen.\n\n⚠️ This is first aid guidance only. Seek professional medical care for serious conditions.`,
  };

  if (conditionKey && fallbacks[conditionKey]) return fallbacks[conditionKey];

  return `🩺 **MediAid AI — First Aid Assistant**\n\nI can help you with first aid guidance for:\n- 🔥 Burns and scalds\n- ❤️ CPR and cardiac emergencies\n- 😮‍💨 Choking\n- 🩸 Bleeding and wounds\n- 🐍 Snake/animal bites\n- 🦴 Fractures and sprains\n- 🤒 Fever management\n- ⚡ Seizures\n- And much more...\n\n**Please describe the emergency situation**, and I'll provide step-by-step first aid protocol.\n\n⚠️ For life-threatening emergencies, call emergency services immediately: 911 (USA) | 112 (International) | 1122 (Pakistan) | 108 (India)`;
}

function getSuggestedQueries(conditionKey, language) {
  const suggestions = {
    burn: ['How to treat chemical burns?', 'When to go to hospital for burns?', 'Natural remedies for minor burns'],
    cpr: ['CPR for children', 'How to use an AED?', 'CPR for infants'],
    wound: ['How to stop deep bleeding?', 'When does a cut need stitches?', 'Signs of wound infection'],
    snake: ['Which snakes are venomous?', 'Snake bite treatment without antivenom', 'Signs of snake venom'],
    default: ['How to treat burns?', 'CPR steps', 'Choking first aid', 'Bleeding control'],
  };
  return suggestions[conditionKey] || suggestions.default;
}

// ── ChatLog model (inline to avoid extra file)
const chatLogSchema = new (require('mongoose').Schema)({
  user: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User', default: null },
  message: String,
  response: String,
  conditionKey: String,
  language: { type: String, default: 'en' },
  usedAI: { type: Boolean, default: false },
  matchedSolutions: [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Solution' }],
}, { timestamps: true });

chatLogSchema.index({ user: 1, createdAt: -1 });
chatLogSchema.index({ conditionKey: 1, createdAt: -1 });

const ChatLog = require('mongoose').model('ChatLog', chatLogSchema);
exports.ChatLog = ChatLog;
