// ══════════════════════════════
// FIRST AID DATABASE
// ══════════════════════════════
export const firstAidDB = {
  burn: {
    title: 'Burns', severity: 'critical',
    keywords: ['burn','burning','fire','hot','scald','boiling'],
    steps: [
      'Cool burn immediately with cool (not cold) running water for 10–20 minutes.',
      'Remove jewelry/clothing near burn area (not if stuck to skin).',
      'Cover loosely with sterile dressing or cling wrap.',
      'Do NOT apply ice, butter, toothpaste, or cream.',
      'For large/severe burns: call emergency. Keep victim warm.',
      'Elevate burned limbs above heart level if possible.',
    ],
    homeRemedies: ['Aloe vera gel (after cooling)', 'Honey dressing (antibacterial)', 'Cool cucumber slices'],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch Video', url: 'https://www.youtube.com/results?search_query=burn+first+aid' },
  },
  cpr: {
    title: 'CPR / Cardiac Arrest', severity: 'critical',
    keywords: ['cpr','cardiac','heart attack','not breathing','unconscious','collapse'],
    steps: [
      'Check scene safety. Call emergency services (911/115/999).',
      'Check response: tap shoulders firmly and shout.',
      'If unresponsive and not breathing normally: start CPR.',
      '30 chest compressions: 2 inches deep, 100–120/min.',
      '2 rescue breaths: tilt head, lift chin, seal mouth, blow until chest rises.',
      'Continue 30:2 cycle until AED arrives or emergency services take over.',
    ],
    homeRemedies: [],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch CPR Video', url: 'https://www.youtube.com/results?search_query=CPR+how+to+AHA' },
  },
  choking: {
    title: 'Choking', severity: 'critical',
    keywords: ['chok','heimlich','airway','can\'t breathe','throat blocked'],
    steps: [
      'Ask: "Are you choking?" If yes: act immediately.',
      '5 back blows: heel of hand between shoulder blades.',
      '5 abdominal thrusts (Heimlich): fist above navel, upward thrusts.',
      'Alternate until object dislodges or victim goes unconscious.',
      'If unconscious: call emergency, begin CPR, look for object before each breath.',
      'For infants: 5 back blows + 5 chest thrusts (no abdominal thrusts).',
    ],
    homeRemedies: [],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch Video', url: 'https://www.youtube.com/results?search_query=choking+first+aid+heimlich' },
  },
  wound: {
    title: 'Wound / Bleeding', severity: 'moderate',
    keywords: ['wound','bleed','cut','laceration','blood','injury'],
    steps: [
      'Apply direct pressure with clean cloth or bandage.',
      'Keep pressure on continuously for 10–15 minutes.',
      'Elevate the injured area above heart level if possible.',
      'If blood soaks through, add more layers — do not remove first cloth.',
      'For deep/gaping wounds: seek emergency care.',
      'Clean wound gently with running water after bleeding slows.',
    ],
    homeRemedies: ['Turmeric paste (antimicrobial)', 'Honey (antibacterial dressing)', 'Plantain leaf (traditional)'],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch Video', url: 'https://www.youtube.com/results?search_query=wound+first+aid' },
  },
  fever: {
    title: 'Fever', severity: 'moderate',
    keywords: ['fever','high temperature','hot','chills','febrile'],
    steps: [
      'Measure temperature: normal is 37°C (98.6°F). Fever is above 38°C.',
      'Remove excess clothing and cover with a light sheet.',
      'Give paracetamol (acetaminophen) or ibuprofen per dosage instructions.',
      'Encourage fluids: water, clear broth, diluted juices.',
      'Sponge with lukewarm water if very high fever.',
      'Seek care: fever >39.5°C, child under 3 months, or fever lasting >3 days.',
    ],
    homeRemedies: ['Lukewarm sponge bath', 'Tulsi (holy basil) tea', 'Ginger tea with honey', 'Wet socks technique'],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch Video', url: 'https://www.youtube.com/results?search_query=fever+management+first+aid' },
  },
  fracture: {
    title: 'Fracture / Broken Bone', severity: 'moderate',
    keywords: ['fracture','broken','bone','snap','break','crack'],
    steps: [
      'Keep the person still and calm.',
      'Immobilize the injured area — do NOT straighten a deformed limb.',
      'Improvise a splint: newspaper, rolled magazine, or sticks padded with cloth.',
      'Apply ice pack (wrapped) to reduce swelling.',
      'Elevate if possible without causing pain.',
      'Seek emergency care immediately.',
    ],
    homeRemedies: ['Turmeric milk (bone healing support)', 'Arnica compress (pain relief)', 'Cold compress (swelling)'],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch Video', url: 'https://www.youtube.com/results?search_query=fracture+first+aid+splinting' },
  },
  snake: {
    title: 'Snake Bite', severity: 'critical',
    keywords: ['snake','bite','venom','serpent','reptile'],
    steps: [
      'Keep victim calm and still — movement spreads venom faster.',
      'Immobilize bitten limb at or below heart level.',
      'Remove jewelry and tight clothing from bitten area.',
      'Mark the edge of swelling with pen and time every 15 minutes.',
      'Call emergency/Poison Control immediately.',
      'Do NOT cut, suck, or tourniquet. Do NOT apply ice.',
    ],
    homeRemedies: ['Immobilization (most important)', 'Keep below heart level'],
    pdf: { title: 'PDF Guide', url: '#' },
    video: { title: 'Watch Video', url: 'https://www.youtube.com/results?search_query=snake+bite+first+aid' },
  },
};

// ══════════════════════════════
// I18N
// ══════════════════════════════
export const i18n = {
  en: { desc: 'AI-powered clinical first aid guidance. Ask about any emergency situation.', placeholder: 'Describe symptoms or emergency situation...' },
  ur: { desc: 'AI سے چلنے والی طبی ابتدائی طبی امداد۔ کسی بھی ہنگامی صورتحال کے بارے میں پوچھیں۔', placeholder: 'علامات یا ہنگامی صورتحال بیان کریں...' },
  hi: { desc: 'AI-संचालित क्लिनिकल प्राथमिक चिकित्सा मार्गदर्शन। किसी भी आपातकालीन स्थिति के बारे में पूछें।', placeholder: 'लक्षण या आपातकालीन स्थिति का वर्णन करें...' },
  ar: { desc: 'إرشادات الإسعافات الأولية السريرية بالذكاء الاصطناعي. اسأل عن أي حالة طارئة.', placeholder: 'صف الأعراض أو حالة الطوارئ...' },
  fr: { desc: 'Orientation clinique de premiers secours par IA. Posez des questions sur toute situation d\'urgence.', placeholder: 'Décrivez les symptômes ou la situation d\'urgence...' },
  es: { desc: 'Orientación clínica de primeros auxilios por IA. Pregunte sobre cualquier situación de emergencia.', placeholder: 'Describa síntomas o situación de emergencia...' },
  sw: { desc: 'Mwongozo wa huduma ya kwanza ya kliniki unaotumia AI. Uliza kuhusu hali yoyote ya dharura.', placeholder: 'Elezea dalili au hali ya dharura...' },
  bn: { desc: 'AI-চালিত ক্লিনিকাল প্রাথমিক চিকিৎসা নির্দেশনা। যেকোনো জরুরি পরিস্থিতি সম্পর্কে জিজ্ঞাসা করুন।', placeholder: 'লক্ষণ বা জরুরি পরিস্থিতি বর্ণনা করুন...' },
};

export const langCodes = {
  en: 'en-US', ur: 'ur-PK', hi: 'hi-IN', ar: 'ar-SA',
  fr: 'fr-FR', es: 'es-ES', sw: 'sw-KE', bn: 'bn-BD',
};

export const voiceGreetings = {
  en: 'MediAid AI is ready. Describe your emergency and I will guide you.',
  ur: 'میڈی ایڈ اے آئی تیار ہے۔ اپنی ایمرجنسی بیان کریں اور میں آپ کی رہنمائی کروں گا۔',
  hi: 'मेडीएड एआई तैयार है। अपनी आपात स्थिति बताएं और मैं आपका मार्गदर्शन करूंगा।',
  ar: 'ميدي إيد الذكاء الاصطناعي جاهز. صف حالتك الطارئة وسأرشدك.',
  fr: 'MediAid IA est prêt. Décrivez votre urgence et je vous guiderai.',
};

export const voiceFallbacks = {
  en: [
    'I can help with burns, bleeding, CPR, choking, fractures, fever, snake bites, and many more emergencies. Please describe the situation in detail.',
    'For any emergency, always call local emergency services first. Describe the symptoms so I can provide the right protocol.',
    'I\'m ready to provide first aid guidance. What is the emergency?',
  ],
  ur: ['میں مدد کر سکتا ہوں۔ براہ کرم صورتحال بیان کریں۔'],
  hi: ['मैं मदद कर सकता हूँ। कृपया स्थिति का वर्णन करें।'],
  ar: ['يمكنني المساعدة. يرجى وصف الحالة.'],
  fr: ['Je peux aider. Veuillez décrire la situation.'],
};

// ══════════════════════════════
// SITUATIONS DATABASE
// ══════════════════════════════
export const situationsDB = {
  blood_loss: { emoji:'🩸', color:'#ff3b5c', title:'HEAVY BLOOD LOSS', severity:'critical', desc:'Severe hemorrhage requiring immediate intervention to prevent shock.', steps:['Apply firm direct pressure with clean cloth or dressing.','Do NOT remove blood-soaked cloth — add more on top.','Elevate the injured limb above heart level if possible.','For limb: consider tourniquet if bleeding is life-threatening and uncontrolled.','Call emergency services immediately.','Lay victim down, keep warm — prevent shock.'], dos:['Direct pressure','Elevation','Tourniquet if life-threatening','Call emergency'], donts:['Remove blood-soaked cloth','Give food or water','Leave alone'], remedies:['Cayenne pepper powder (traditional hemostatic)','Yarrow herb compress','Pressure and elevation most important'], resources:[{type:'pdf',icon:'📄',name:'Hemorrhage Control Manual',desc:'TCCC tourniquet and pressure dressing guide.',meta:'Red Cross · EN/UR/HI · 2.3 MB',url:'#'},{type:'video',icon:'🎬',name:'Stop the Bleed — Official',desc:'Stop the Bleed campaign training video.',meta:'10 min',url:'https://www.youtube.com/results?search_query=stop+the+bleed+tourniquet+training'}] },
  deep_cut: { emoji:'🔪', color:'#f72585', title:'DEEP CUT / LACERATION', severity:'moderate', desc:'Full-thickness skin wound potentially needing stitches.', steps:['Rinse cut under clean running water for 5 minutes.','Apply gentle pressure with sterile gauze.','Inspect: if deep, gaping, or won\'t close — needs stitches.','Apply antiseptic (iodine or alcohol).','Cover with sterile dressing. Change daily.','Seek care for deep wounds, dirty wounds, or wounds over joints.'], dos:['Clean thoroughly','Assess depth','Antiseptic after cleaning','Stitches if gaping'], donts:['Use cotton wool on wound','Close a dirty wound','Ignore signs of infection'], remedies:['Honey dressing','Turmeric paste (antimicrobial)','Neem water wash'], resources:[{type:'pdf',icon:'📄',name:'Wound Care Field Manual',desc:'Basic wound assessment and treatment.',meta:'MSF · EN/FR · 1.5 MB',url:'#'},{type:'video',icon:'🎬',name:'Wound Closure Techniques',desc:'First aid wound care and dressing.',meta:'7 min',url:'https://www.youtube.com/results?search_query=deep+cut+wound+first+aid+stitches'}] },
  nosebleed: { emoji:'👃', color:'#ffb830', title:'NOSEBLEED', severity:'mild', desc:'Anterior or posterior nasal bleeding — usually manageable.', steps:['Sit upright, lean slightly forward (not backward).','Pinch soft part of nose (just below the bony part) firmly.','Breathe through the mouth. Hold for 10–15 minutes continuously.','Apply ice pack to bridge of nose.','Do NOT tilt head back — blood may go to throat.','If bleeding continues >20 min or follows head injury: seek care.'], dos:['Lean forward','Pinch soft nose','Ice pack','Time the bleed'], donts:['Tilt head back','Stuff with tissue tightly','Blow nose during bleed'], remedies:['Cold compress on neck/forehead','Saline nasal drops','Onion smell (traditional vasoconstrictor)'], resources:[{type:'pdf',icon:'📄',name:'Nosebleed Management Guide',desc:'Assessment and management of epistaxis.',meta:'NHS · EN · 0.5 MB',url:'#'},{type:'video',icon:'🎬',name:'Nosebleed First Aid Video',desc:'Correct position and pinch technique.',meta:'3 min',url:'https://www.youtube.com/results?search_query=nosebleed+first+aid+correct+technique'}] },
  internal_bleed: { emoji:'🫀', color:'#ff3b5c', title:'INTERNAL BLEEDING', severity:'critical', desc:'Bleeding inside the body — invisible externally. Life-threatening emergency.', steps:['Call emergency services IMMEDIATELY.','Do NOT give food, water, or medication by mouth.','Keep person still, lying down with legs elevated (if no spinal injury).','Keep warm with blankets.','Monitor breathing and pulse. Begin CPR if they lose consciousness.','Do NOT leave alone until help arrives.'], dos:['Call emergency immediately','Keep still and warm','Monitor breathing','Elevate legs if no spinal injury'], donts:['Give aspirin (thins blood)','Leave alone','Apply pressure to abdomen','Give anything by mouth'], remedies:['No home remedy — hospital surgery/transfusion required.'], resources:[{type:'pdf',icon:'📄',name:'Internal Bleeding Guide',desc:'Signs, symptoms, and emergency response.',meta:'Red Cross · EN · 1.2 MB',url:'#'},{type:'video',icon:'🎬',name:'Recognising Internal Bleeding',desc:'Signs and emergency response explained.',meta:'6 min',url:'https://www.youtube.com/results?search_query=internal+bleeding+signs+symptoms+first+aid'}] },
  choking: { emoji:'😮‍💨', color:'#ff3b5c', title:'CHOKING', severity:'critical', desc:'Foreign body airway obstruction — can be fatal within minutes.', steps:['Ask: "Are you choking?" If yes — act immediately.','5 back blows between shoulder blades with heel of hand.','5 abdominal thrusts: stand behind, fist above navel, sharp upward thrusts.','Alternate 5+5 until object clears or victim loses consciousness.','If unconscious: lower to ground, call emergency, start CPR, look for object before breaths.','Infants: 5 back blows + 5 chest thrusts (not abdominal).'], dos:['Back blows first','Heimlich thrusts','Check mouth for object','CPR if unconscious'], donts:['Blind finger sweeps in mouth','Shake or pat too gently','Wait and watch'], remedies:['No home remedy — act immediately'], resources:[{type:'pdf',icon:'📄',name:'Choking Response Chart',desc:'Visual guide for adult/child/infant choking.',meta:'AHA · EN/UR · 1.8 MB',url:'#'},{type:'video',icon:'🎬',name:'Heimlich Manoeuvre Video',desc:'AHA/Red Cross official choking response.',meta:'6 min',url:'https://www.youtube.com/results?search_query=heimlich+maneuver+choking+first+aid'}] },
  asthma_attack: { emoji:'🌬️', color:'#00c8e8', title:'ASTHMA ATTACK', severity:'critical', desc:'Sudden airway narrowing causing severe breathing difficulty.', steps:['Sit person upright, leaning slightly forward. Do NOT lay them down.','Help use reliever inhaler (blue/salbutamol) — 1 puff every 30–60 sec, up to 10 puffs.','If no inhaler: call emergency services immediately.','Encourage slow, steady breathing.','Call 999/911/115 if no improvement after 10 puffs or condition worsens.','Continue inhaler every 10 min until help arrives.'], dos:['Keep upright','Use inhaler','Slow steady breaths','Call emergency if no inhaler'], donts:['Lay person flat','Leave alone','Give food/drink during attack'], remedies:['Steam inhalation with eucalyptus (mild only)','Ginger tea (supplemental)','Honey in warm water (mild relief)'], resources:[{type:'pdf',icon:'📄',name:'Asthma Action Plan',desc:'GINA guidelines personalized plan.',meta:'GINA · EN/UR/HI · 0.8 MB',url:'#'},{type:'video',icon:'🎬',name:'Asthma Attack First Aid',desc:'How to help during asthma attack.',meta:'5 min',url:'https://www.youtube.com/results?search_query=asthma+attack+first+aid+inhaler'}] },
  drowning: { emoji:'🌊', color:'#00c8e8', title:'DROWNING EMERGENCY', severity:'critical', desc:'Submersion causing respiratory impairment. Act within minutes.', steps:['Ensure YOUR safety first — do not enter dangerous water without training.','Call emergency services immediately.','Remove person from water if safe.','If unconscious and not breathing: begin CPR immediately (30:2).','Recovery position if breathing but unconscious.','Keep warm — remove wet clothes.','ALL drowning victims need medical evaluation even if apparently recovered.'], dos:['Call emergency first','CPR if not breathing','Keep warm','Medical evaluation always'], donts:['Enter water unless trained','Shake victim upside down','Assume fine if quick recovery'], remedies:['CPR and emergency services are essential.'], resources:[{type:'pdf',icon:'📄',name:'Drowning Response Protocol',desc:'WHO/ILSE rescue and resuscitation guidelines.',meta:'WHO · EN/FR · 2.0 MB',url:'#'},{type:'video',icon:'🎬',name:'Drowning First Aid & CPR',desc:'Post-rescue CPR and recovery.',meta:'9 min',url:'https://www.youtube.com/results?search_query=drowning+first+aid+CPR+rescue'}] },
  cpr: { emoji:'❤️', color:'#ff3b5c', title:'CARDIAC ARREST / CPR', severity:'critical', desc:'Sudden cessation of heart function. Brain damage begins within 4 minutes.', steps:['Check scene safety. Tap shoulders, shout: "Are you OK?"','Call emergency services (911/115/999) or send someone to call.','Check for normal breathing — no more than 10 seconds.','Start chest compressions: 30 compressions, 2 inches deep, 100–120/min.','2 rescue breaths after every 30 compressions.','Continue 30:2 until AED arrives, help takes over, or person recovers.'], dos:['Call emergency first','Hard and fast compressions','Use AED as soon as available','Continue without stopping'], donts:['Stop if person gasps','Compress too slowly','Wait to start — every second counts'], remedies:['CPR is the only intervention.'], resources:[{type:'pdf',icon:'📄',name:'AHA CPR Guidelines',desc:'2023 CPR and ECC guidelines.',meta:'AHA · EN/AR/ES · 4.5 MB',url:'#'},{type:'video',icon:'🎬',name:'Adult CPR Training Video',desc:'AHA Hands-Only CPR demo.',meta:'8 min',url:'https://www.youtube.com/results?search_query=adult+CPR+AHA+hands+only'}] },
  heatstroke: { emoji:'☀️', color:'#ffb830', title:'HEATSTROKE', severity:'critical', desc:'Body temp exceeds 40°C (104°F). Brain damage can occur rapidly.', steps:['Call emergency services immediately.','Move to cool, shaded area.','Cool rapidly: cold wet cloths to neck, armpits, groin. Fan the person.','Give cool water to sip slowly if conscious.','Do NOT give aspirin or paracetamol.','Keep cooling until temp drops below 39°C or help arrives.'], dos:['Cool rapidly','Move to shade','Cold cloths: neck/armpits/groin','Call emergency'], donts:['Give aspirin or ibuprofen','Use ice water (shock risk)','Leave alone'], remedies:['Fan and wet cloths','Coconut water/ORS if conscious','Vetiver (khus) cooling drink'], resources:[{type:'pdf',icon:'📄',name:'Heat Illness Response Guide',desc:'Heat exhaustion vs heatstroke response.',meta:'CDC · EN/ES · 1.1 MB',url:'#'},{type:'video',icon:'🎬',name:'Heatstroke First Aid',desc:'Signs and immediate cooling methods.',meta:'5 min',url:'https://www.youtube.com/results?search_query=heatstroke+first+aid+symptoms+cooling'}] },
  chemical_burn: { emoji:'⚗️', color:'#ff3b5c', title:'CHEMICAL BURNS', severity:'critical', desc:'Burns from acids, alkalis, or corrosive chemicals — can worsen rapidly.', steps:['Protect yourself — gloves or plastic bags before touching victim.','Remove contaminated clothing/jewelry carefully.','Flush with large amounts of cool running water for at least 20 minutes.','Do NOT neutralize — reactions generate heat and worsen injury.','Cover loosely with sterile dressing after flushing.','Call Poison Control or emergency services.','Eye exposure: flush 20+ minutes, seek immediate eye care.'], dos:['Flush 20+ minutes','Remove contaminated clothing','Call poison control','Protect yourself'], donts:['Neutralize acid/base','Apply ice, butter, or creams','Rub the area','Delay flushing'], remedies:['Cool running water only','Aloe vera AFTER thorough flushing for minor cases'], resources:[{type:'pdf',icon:'📄',name:'Chemical Burn Management',desc:'Industrial and household chemical exposure protocol.',meta:'Poison Control · EN · 1.5 MB',url:'#'},{type:'video',icon:'🎬',name:'Chemical Burn First Aid',desc:'Correct flushing technique.',meta:'6 min',url:'https://www.youtube.com/results?search_query=chemical+burn+first+aid+treatment'}] },
  sunburn: { emoji:'🌅', color:'#ffb830', title:'SUNBURN', severity:'mild', desc:'UV radiation skin damage — usually mild, but severe cases blister.', steps:['Get out of the sun immediately.','Cool skin with cool water or damp cloth for 15–20 minutes.','Drink plenty of water to rehydrate.','Apply aloe vera gel or soothing moisturizer.','Take ibuprofen or paracetamol for pain.','Do NOT pop blisters.','Seek care for severe blistering, high fever, or large area.'], dos:['Cool skin','Stay hydrated','Apply aloe vera','Stay out of sun until healed'], donts:['Pop blisters','Apply butter or toothpaste','Re-expose to sun before healed'], remedies:['Fresh aloe vera gel','Cucumber slices (cooling)','Cold green tea compress','Oatmeal bath for itch'], resources:[{type:'pdf',icon:'📄',name:'Sunburn Care Guide',desc:'From mild redness to severe blistering.',meta:'Skin Foundation · EN · 0.6 MB',url:'#'},{type:'video',icon:'🎬',name:'Sunburn Treatment & Remedies',desc:'Home treatment and when to seek care.',meta:'4 min',url:'https://www.youtube.com/results?search_query=sunburn+first+aid+treatment+remedies'}] },
  sprain: { emoji:'🦵', color:'#ffb830', title:'SPRAIN / STRAIN', severity:'mild', desc:'Stretch or tear of ligaments or muscles from sudden movement.', steps:['Rest — stop using the injured area immediately.','Ice — ice pack wrapped in cloth for 20 min every 2 hours for 48 hours.','Compression — wrap with elastic bandage, firm but not too tight.','Elevation — raise injured limb above heart level.','Ibuprofen for pain and swelling.','Seek care if: can\'t bear weight, severe swelling, or no improvement in 3–5 days.'], dos:['RICE: Rest, Ice, Compress, Elevate','Anti-inflammatory medication','Crutches if needed'], donts:['Continue exercise on injury','Apply heat in first 48 hours','Bandage too tightly'], remedies:['Turmeric + ginger paste compress','Arnica gel (traditional)','Cabbage leaf wrap (cooling)','Epsom salt soak after 48h'], resources:[{type:'pdf',icon:'📄',name:'Sprain & Strain Guide',desc:'RICE protocol and rehabilitation.',meta:'Physio UK · EN · 0.9 MB',url:'#'},{type:'video',icon:'🎬',name:'RICE Method for Sprains',desc:'Demonstration of RICE technique.',meta:'5 min',url:'https://www.youtube.com/results?search_query=RICE+method+sprain+first+aid'}] },
  insect_sting: { emoji:'🐝', color:'#ffb830', title:'INSECT STING (BEE/WASP)', severity:'moderate', desc:'Bee, wasp, or hornet sting. Severe in allergic individuals.', steps:['Remove stinger by scraping sideways with card or fingernail — NOT tweezers.','Wash with soap and water.','Ice pack wrapped in cloth for 20 minutes.','Antihistamine (cetirizine) for itch/swelling.','Watch for anaphylaxis: throat tightening, breathing difficulty, widespread hives.','Anaphylaxis signs: use EpiPen, call emergency IMMEDIATELY.'], dos:['Scrape stinger (not tweezers)','Ice pack','Antihistamine','Watch for allergic reaction'], donts:['Squeeze stinger with tweezers','Scratch area','Ignore spreading swelling'], remedies:['Baking soda paste for bee sting','Vinegar compress for wasp sting','Raw onion slice (traditional)','Plantain leaf poultice'], resources:[{type:'pdf',icon:'📄',name:'Insect Sting Response Guide',desc:'Including anaphylaxis response.',meta:'Red Cross · EN · 0.8 MB',url:'#'},{type:'video',icon:'🎬',name:'Bee Sting First Aid',desc:'Stinger removal and sting treatment.',meta:'4 min',url:'https://www.youtube.com/results?search_query=bee+sting+first+aid+stinger+removal'}] },
  dog_bite: { emoji:'🐕', color:'#ffb830', title:'ANIMAL / DOG BITE', severity:'moderate', desc:'Animal bite — risk of infection, rabies, and tetanus.', steps:['Wash wound immediately with soap and water for at least 5 minutes.','Apply antiseptic (iodine or alcohol) after washing.','Cover with clean bandage.','Seek medical care for ALL animal bites — rabies/tetanus assessment critical.','Note the animal: domestic/wild, vaccinated/unknown, provoked/unprovoked.','Rabies PEP must begin within 24–48 hours if rabies risk exists.'], dos:['Thorough soap and water washing','Medical care same day','Report the bite','Get rabies PEP if risk exists'], donts:['Ignore or delay care','Close wound tightly without evaluation','Assume animal is vaccinated'], remedies:['Soap and water washing is the most critical step','Turmeric paste after washing','Neem leaf boiled water as wash'], resources:[{type:'pdf',icon:'📄',name:'Animal Bite & Rabies Guide',desc:'WHO post-exposure rabies protocol.',meta:'WHO · EN/HI/UR · 1.9 MB',url:'#'},{type:'video',icon:'🎬',name:'Dog Bite First Aid',desc:'Treatment and when to seek emergency care.',meta:'5 min',url:'https://www.youtube.com/results?search_query=dog+bite+first+aid+rabies'}] },
  seizure: { emoji:'⚡', color:'#ff3b5c', title:'SEIZURE / EPILEPSY', severity:'critical', desc:'Uncontrolled brain electrical activity causing involuntary movements.', steps:['Stay calm. Time the seizure from start.','Clear area of hard/sharp objects. Do NOT restrain.','Place soft flat material under the head.','Roll to recovery position after convulsions stop.','Do NOT put anything in their mouth.','Call emergency if: >5 minutes, no return to consciousness, or second seizure.','Stay until fully conscious. Speak calmly.'], dos:['Time the seizure','Clear surroundings','Recovery position after','Call emergency if >5 min'], donts:['Restrain person','Put anything in mouth','Give water until conscious','Leave alone'], remedies:['No home remedy — protect from harm and call emergency if prolonged.'], resources:[{type:'pdf',icon:'📄',name:'Seizure First Aid Protocol',desc:'Epilepsy Foundation guidelines.',meta:'Epilepsy Foundation · EN/ES · 1.0 MB',url:'#'},{type:'video',icon:'🎬',name:'Seizure First Aid Video',desc:'What to do and NOT do.',meta:'5 min',url:'https://www.youtube.com/results?search_query=seizure+first+aid+epilepsy+what+to+do'}] },
  allergic: { emoji:'⚠️', color:'#ff3b5c', title:'ANAPHYLAXIS', severity:'critical', desc:'Life-threatening allergic reaction from food, stings, medications, or latex.', steps:['Call emergency services IMMEDIATELY.','Use EpiPen if available — inject outer thigh.','Lay flat; if breathing difficulty, sit up slightly.','Second EpiPen after 5–15 minutes if no improvement.','Keep still and warm.','CPR if loses consciousness and stops breathing.','ALWAYS go to hospital after EpiPen — biphasic reaction risk.'], dos:['EpiPen immediately if available','Call emergency','Lay flat or semi-upright','Hospital after EpiPen'], donts:['Wait for improvement','Antihistamine alone for anaphylaxis','Allow to stand/walk','Leave alone'], remedies:['EpiPen is the ONLY treatment for anaphylaxis','Antihistamines for mild reactions only'], resources:[{type:'pdf',icon:'📄',name:'Anaphylaxis Action Plan',desc:'Recognition, EpiPen use, and emergency plan.',meta:'ASCIA · EN/AR · 0.9 MB',url:'#'},{type:'video',icon:'🎬',name:'Anaphylaxis & EpiPen',desc:'Recognize anaphylaxis and administer epinephrine.',meta:'7 min',url:'https://www.youtube.com/results?search_query=anaphylaxis+first+aid+epipen+how+to+use'}] },
  stroke: { emoji:'🧠', color:'#ff3b5c', title:'STROKE', severity:'critical', desc:'"Time is Brain" — interruption of blood supply. Every minute counts.', steps:['FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.','Call emergency services IMMEDIATELY.','Note time symptoms started — determines treatment options.','Keep calm and lying down. No food or water.','Unconscious breathing: recovery position. Not breathing: CPR.','Do NOT give aspirin unless instructed by emergency services.'], dos:['FAST assessment','Call emergency immediately','Note exact symptom start time','Keep still and calm'], donts:['Delay calling emergency','Give aspirin without instruction','Give food or water','Leave alone'], remedies:['No home remedy — hospital clot-busting treatment must happen within 3–4.5 hours.'], resources:[{type:'pdf',icon:'📄',name:'Stroke Recognition FAST Guide',desc:'FAST assessment and emergency response.',meta:'Stroke Association · EN/UR/HI · 0.7 MB',url:'#'},{type:'video',icon:'🎬',name:'FAST Stroke Recognition',desc:'Identify stroke signs and respond in time.',meta:'4 min',url:'https://www.youtube.com/results?search_query=stroke+FAST+recognition+first+aid'}] },
  diabetic: { emoji:'🍬', color:'#ffb830', title:'DIABETIC EMERGENCY', severity:'critical', desc:'Low (hypoglycemia) or high (hyperglycemia) blood sugar — both urgent.', steps:['If conscious, suspected low blood sugar (sweating, shaking, pale, confused): give sugar immediately — juice, glucose tablets, or regular soda.','Recheck in 15 minutes. Repeat sugar if still symptomatic.','If unconscious/can\'t swallow: nothing by mouth. Call emergency.','Suspected high blood sugar (thirst, fruity breath): water if conscious, call for help.','If unsure: give sugar first — hypoglycemia is more immediately dangerous.'], dos:['Give sugar if conscious and low blood sugar','Call emergency if unconscious','Check medic-alert bracelet','Monitor until normal'], donts:['Give food/drink if unconscious','Give insulin unless trained','Leave alone'], remedies:['Glucose tablets (best)','Fruit juice 150ml','Regular soda','Sugar cubes in water','Raisins or honey if nothing else'], resources:[{type:'pdf',icon:'📄',name:'Diabetic Emergency Guide',desc:'Hypo and hyperglycemia recognition and response.',meta:'Diabetes UK · EN/UR · 1.3 MB',url:'#'},{type:'video',icon:'🎬',name:'Diabetic Emergency First Aid',desc:'Recognizing and responding to blood sugar crises.',meta:'6 min',url:'https://www.youtube.com/results?search_query=diabetic+emergency+first+aid+hypoglycemia'}] },
  poisoning: { emoji:'☠️', color:'#ff3b5c', title:'POISONING / OVERDOSE', severity:'critical', desc:'Ingestion, inhalation, or skin contact with toxic substances.', steps:['Call Poison Control or emergency services IMMEDIATELY.','Identify the substance — take container to hospital.','Do NOT induce vomiting unless specifically instructed.','Skin/eye contact: flush with cool water 15–20 minutes.','Unconscious: recovery position. Not breathing: CPR.','Stay on phone with poison control until help arrives.'], dos:['Call poison control immediately','Identify the substance','Follow instructions exactly','Flush skin/eye exposure'], donts:['Induce vomiting without instruction','Give milk/oil without instruction','Leave alone','Delay calling emergency'], remedies:['Activated charcoal — only if instructed within 1 hour','No general home remedy — all poisonings need professional guidance'], resources:[{type:'pdf',icon:'📄',name:'Poisoning Response Manual',desc:'Household, drug, and chemical poisoning guide.',meta:'Poison Control · EN/ES · 2.8 MB',url:'#'},{type:'video',icon:'🎬',name:'Poisoning First Aid',desc:'What to do in case of poisoning or overdose.',meta:'7 min',url:'https://www.youtube.com/results?search_query=poisoning+overdose+first+aid+what+to+do'}] },
  scorpion: { emoji:'🦂', color:'#ff3b5c', title:'SCORPION STING', severity:'critical', desc:'Can be life-threatening especially in children. Antivenom is the treatment.', steps:['Move to safety away from scorpion.','Call Poison Control or emergency services — especially for children.','Keep stung area below heart level.','Cool damp cloth to sting site for comfort.','Monitor: breathing difficulty, muscle spasms, drooling, blurred vision.','Get antivenom at hospital immediately if child was stung or severe symptoms.'], dos:['Call poison control/emergency','Sting below heart level','Cool compress','Antivenom for children'], donts:['Apply tourniquet','Cut and suck venom','Apply heat','Give alcohol'], remedies:['Cool compress for pain','Baking soda paste for mild cases','Hospital antivenom essential for severe cases'], resources:[{type:'pdf',icon:'📄',name:'Scorpion Sting Protocol',desc:'Regional scorpion sting management.',meta:'WHO · EN/AR/FR · 1.4 MB',url:'#'},{type:'video',icon:'🎬',name:'Scorpion Sting First Aid',desc:'Immediate response and warning signs.',meta:'6 min',url:'https://www.youtube.com/results?search_query=scorpion+sting+first+aid+treatment'}] },
  seizure: { emoji:'⚡', color:'#ff3b5c', title:'SEIZURE / EPILEPSY', severity:'critical', desc:'Uncontrolled brain electrical activity causing involuntary movements.', steps:['Stay calm. Time the seizure from start.','Clear area of hard/sharp objects. Do NOT restrain.','Place soft flat material under the head.','Roll to recovery position after convulsions stop.','Do NOT put anything in their mouth.','Call emergency if: >5 minutes, no return to consciousness, or second seizure.','Stay until fully conscious. Speak calmly.'], dos:['Time the seizure','Clear surroundings','Recovery position after','Call emergency if >5 min'], donts:['Restrain person','Put anything in mouth','Give water until conscious','Leave alone'], remedies:['No home remedy — protect from harm and call emergency if prolonged.'], resources:[{type:'pdf',icon:'📄',name:'Seizure First Aid Protocol',desc:'Epilepsy Foundation guidelines.',meta:'Epilepsy Foundation · EN/ES · 1.0 MB',url:'#'},{type:'video',icon:'🎬',name:'Seizure First Aid Video',desc:'What to do and NOT do.',meta:'5 min',url:'https://www.youtube.com/results?search_query=seizure+first+aid+epilepsy+what+to+do'}] },
  spinal_injury: { emoji:'🧠', color:'#ff3b5c', title:'SUSPECTED SPINAL INJURY', severity:'critical', desc:'Wrong movement can cause permanent paralysis — do NOT move the patient.', steps:['Do NOT move the person — most critical rule.','Call emergency services immediately.','Stabilize head and neck in found position — hands on both sides of head.','Keep talking and still.','If unconscious, not breathing: jaw thrust (NOT head tilt) and CPR.','Cover to prevent hypothermia. No food/water by mouth.'], dos:['Keep completely still','Stabilize neck/head manually','Call emergency','Keep warm'], donts:['Move unless extreme danger','Head tilt for airway — use jaw thrust','Remove helmet','Leave alone'], remedies:['Immobilization and emergency care only.'], resources:[{type:'pdf',icon:'📄',name:'Spinal Injury Protocol',desc:'Trauma guidelines for spinal cord injury.',meta:'WHO · EN/FR · 2.5 MB',url:'#'},{type:'video',icon:'🎬',name:'Spinal Injury First Aid',desc:'How to immobilize suspected spine injury.',meta:'8 min',url:'https://www.youtube.com/results?search_query=spinal+injury+first+aid+immobilization'}] },
  dislocation: { emoji:'💪', color:'#ffb830', title:'JOINT DISLOCATION', severity:'moderate', desc:'Bone forced out of its joint — commonly shoulder, finger, knee.', steps:['Do NOT try to push the joint back — can cause further damage.','Immobilize in position found with sling or padded splint.','Apply ice pack wrapped in cloth to reduce pain and swelling.','Seek emergency care — X-ray needed to rule out fracture.','Monitor circulation below injury: pulse, warmth, sensation.'], dos:['Immobilize as-is','Ice for pain','Emergency care','Monitor circulation'], donts:['"Pop" joint back in','Move unnecessarily','Apply heat','Delay medical care'], remedies:['Ice for pain relief','Immobilization with cloth/sling','Professional reduction required'], resources:[{type:'pdf',icon:'📄',name:'Dislocation First Aid Guide',desc:'Recognition and management of dislocations.',meta:'St Johns · EN · 1.0 MB',url:'#'},{type:'video',icon:'🎬',name:'Dislocation Response',desc:'How to safely immobilize a dislocation.',meta:'5 min',url:'https://www.youtube.com/results?search_query=dislocation+first+aid+shoulder+finger'}] },
  febrile_seizure: { emoji:'🌡️', color:'#ffb830', title:'FEBRILE SEIZURE (CHILD)', severity:'critical', desc:'Rapid temp rise seizures in children 6 months–5 years. Usually brief.', steps:['Stay calm — usually under 5 minutes.','Place child on side on safe, soft surface.','Do NOT hold down or restrain.','Time the seizure — call emergency if >5 minutes.','After seizure: recovery position on side.','Lukewarm sponge bath after seizure ends to lower fever.','Medical evaluation — all first-time febrile seizures need a doctor.'], dos:['Time the seizure','Side on safe surface','Clear airway','Medical care after'], donts:['Put anything in mouth','Restrain child','Medication during active seizure','Cold water for fever'], remedies:['Lukewarm sponge bath after','Paracetamol for fever once conscious'], resources:[{type:'pdf',icon:'📄',name:'Febrile Seizure Parent Guide',desc:'Understanding and managing febrile seizures.',meta:'RCPCH · EN/UR · 0.8 MB',url:'#'},{type:'video',icon:'🎬',name:'Febrile Seizure First Aid',desc:'What to do during a febrile seizure.',meta:'5 min',url:'https://www.youtube.com/results?search_query=febrile+seizure+child+first+aid+what+to+do'}] },
  infant_cpr: { emoji:'👶', color:'#ff3b5c', title:'INFANT CPR (<1 YR)', severity:'critical', desc:'CPR for infants — technique differs significantly from adult CPR.', steps:['Tap foot gently for response. Call emergency or have someone call.','Very gentle head tilt (slight) to open airway.','2 gentle rescue breaths — cover both nose and mouth. Only enough to see chest rise.','2-finger compressions on center of chest. Push 4cm at 100–120/min.','Continue 30:2 cycle.','Continue until baby breathes, help arrives, or you cannot continue.'], dos:['Call emergency immediately','2-finger compressions','Cover both nose and mouth','Gentle head tilt only'], donts:['Adult compression force','Blow too hard','Full neck tilt','Stop until help arrives'], remedies:['Infant CPR only intervention — call emergency services.'], resources:[{type:'pdf',icon:'📄',name:'Infant & Child CPR Guide',desc:'AHA illustrated infant/pediatric CPR.',meta:'AHA · EN/ES/AR · 2.0 MB',url:'#'},{type:'video',icon:'🎬',name:'Infant CPR Demonstration',desc:'AHA official infant CPR video.',meta:'10 min',url:'https://www.youtube.com/results?search_query=infant+CPR+baby+first+aid+AHA'}] },
  emergency_birth: { emoji:'🤱', color:'#f72585', title:'EMERGENCY CHILDBIRTH', severity:'critical', desc:'Delivery before medical help arrives. Stay calm — most births uncomplicated.', steps:['Call emergency services IMMEDIATELY — stay on the line.','Help mother to comfortable position: lying down, knees up, feet flat.','Do NOT try to stop or delay delivery.','As head emerges: support gently — do NOT pull.','After birth: baby skin-to-skin on mother\'s chest. Keep warm.','Do NOT cut cord unless instructed and equipment is sterile.','Placenta delivers within 30 min — do NOT pull the cord.'], dos:['Call emergency','Support baby head as it emerges','Skin-to-skin warmth','Wait for placenta naturally'], donts:['Pull baby out','Cut cord with unsterile tools','Try to stop labor','Leave mother alone'], remedies:['Clean towels to wrap baby','Body heat is best warming','Early breastfeeding helps uterus contract'], resources:[{type:'pdf',icon:'📄',name:'Emergency Delivery Guide',desc:'Step-by-step guide for emergency birth.',meta:'WHO · EN/FR/AR · 3.0 MB',url:'#'},{type:'video',icon:'🎬',name:'Emergency Childbirth Training',desc:'First responder emergency childbirth video.',meta:'12 min',url:'https://www.youtube.com/results?search_query=emergency+childbirth+first+responder+training'}] },
};

// Merge firstAidDB into situationsDB
['burn','cpr','choking','wound','fever','fracture','snake'].forEach(k => {
  if (firstAidDB[k] && !situationsDB[k]) {
    const d = firstAidDB[k];
    const em = {burn:'🔥',cpr:'❤️',choking:'😮‍💨',wound:'🩹',fever:'🌡️',fracture:'🦴',snake:'🐍'};
    const cl = {burn:'#ffb830',cpr:'#ff3b5c',choking:'#ff3b5c',wound:'#f72585',fever:'#ffb830',fracture:'#ffb830',snake:'#ff3b5c'};
    situationsDB[k] = {
      emoji: em[k], color: cl[k], title: d.title.toUpperCase(),
      severity: d.severity,
      desc: `First aid protocol for ${d.title.toLowerCase()}.`,
      steps: d.steps,
      dos: d.steps.slice(0,4).map(s => s.split('.')[0]),
      donts: ['Do NOT delay treatment','Do NOT ignore this condition','Seek help if symptoms are severe'],
      remedies: d.homeRemedies || [],
      resources: [
        {type:'pdf',icon:'📄',name:`${d.title} PDF Guide`,desc:`Field guide for ${d.title.toLowerCase()}.`,meta:'EN/UR/HI',url:d.pdf?.url||'#'},
        {type:'video',icon:'🎬',name:`${d.title} Video`,desc:`Watch: ${d.title}`,meta:'Video',url:d.video?.url||'#'}
      ]
    };
  }
});

// ══════════════════════════════
// RESOURCES DATA
// ══════════════════════════════
export const resData = [
  {type:'pdf', emoji:'🔥', thumb:'t-red', name:'Complete Burn Care Manual', desc:'WHO field guide for burns — minor to severe.', meta:'WHO · EN/UR/HI · 3.2 MB', cat:'burns'},
  {type:'video', emoji:'❤️', thumb:'t-cyan', name:'CPR & AED Training', desc:'Adult, child, and infant CPR with AED.', meta:'AHA · EN/AR/FR · 12 min', cat:'cpr', url:'https://www.youtube.com/results?search_query=CPR+AED+training'},
  {type:'guide', emoji:'🩹', thumb:'t-green', name:'Wound & Bleeding Guide', desc:'Bleeding control and wound dressing protocol.', meta:'MSF · Multi · 1.8 MB', cat:'wound'},
  {type:'pdf', emoji:'🦴', thumb:'t-red', name:'Fracture & Sprain Protocol', desc:'Improvised splinting and immobilization.', meta:'St Johns · EN/ES/SW · 3.1 MB', cat:'fracture'},
  {type:'video', emoji:'😮‍💨', thumb:'t-cyan', name:'Choking Response Video', desc:'Heimlich maneuver for adults and children.', meta:'Red Cross · EN/UR · 8 min', cat:'choking', url:'https://www.youtube.com/results?search_query=choking+first+aid+heimlich'},
  {type:'guide', emoji:'🌿', thumb:'t-green', name:'Home Remedies Handbook', desc:'200+ traditional remedies from 40 cultures.', meta:'Multi · 5.2 MB', cat:'home'},
  {type:'pdf', emoji:'🐍', thumb:'t-red', name:'Snake Bite Protocol', desc:'WHO rural snakebite response guide.', meta:'WHO · EN/HI/SW · 1.5 MB', cat:'snake'},
  {type:'video', emoji:'🤒', thumb:'t-cyan', name:'Fever Management Guide', desc:'All ages — when to treat at home vs. seek care.', meta:'EN/AR/BN · 6 min', cat:'fever', url:'https://www.youtube.com/results?search_query=fever+management+first+aid'},
  {type:'guide', emoji:'☠️', thumb:'t-green', name:'Poisoning & Overdose', desc:'Chemical exposure, overdose, and accidental poisoning.', meta:'EN/FR/ES · 2.0 MB', cat:'poison'},
];

export const situationGroups = [
  {
    id: 'bleed', icon: '🩸', label: 'Bleeding & Wounds', open: true,
    items: [
      { key: 'blood_loss', icon: '🩸', text: 'Heavy Blood Loss', sev: 'critical' },
      { key: 'deep_cut', icon: '🔪', text: 'Deep Cut / Laceration', sev: 'moderate' },
      { key: 'nosebleed', icon: '👃', text: 'Nosebleed', sev: 'mild' },
      { key: 'internal_bleed', icon: '🫀', text: 'Internal Bleeding', sev: 'critical' },
    ]
  },
  {
    id: 'breath', icon: '😮‍💨', label: 'Breathing Emergencies', open: false,
    items: [
      { key: 'choking', icon: '😮‍💨', text: 'Choking', sev: 'critical' },
      { key: 'asthma_attack', icon: '🌬️', text: 'Asthma Attack', sev: 'critical' },
      { key: 'drowning', icon: '🌊', text: 'Drowning', sev: 'critical' },
      { key: 'cpr', icon: '❤️', text: 'Cardiac Arrest / CPR', sev: 'critical' },
    ]
  },
  {
    id: 'burn', icon: '🔥', label: 'Burns & Heat', open: false,
    items: [
      { key: 'burn', icon: '🔥', text: 'Thermal Burns', sev: 'critical' },
      { key: 'chemical_burn', icon: '⚗️', text: 'Chemical Burns', sev: 'critical' },
      { key: 'heatstroke', icon: '☀️', text: 'Heatstroke', sev: 'critical' },
      { key: 'sunburn', icon: '🌅', text: 'Sunburn', sev: 'mild' },
    ]
  },
  {
    id: 'bone', icon: '🦴', label: 'Bones & Muscles', open: false,
    items: [
      { key: 'fracture', icon: '🦴', text: 'Fracture', sev: 'moderate' },
      { key: 'sprain', icon: '🦵', text: 'Sprain / Strain', sev: 'mild' },
      { key: 'dislocation', icon: '💪', text: 'Joint Dislocation', sev: 'moderate' },
      { key: 'spinal_injury', icon: '🧠', text: 'Spinal Injury', sev: 'critical' },
    ]
  },
  {
    id: 'neuro', icon: '🧠', label: 'Neurological', open: false,
    items: [
      { key: 'seizure', icon: '⚡', text: 'Seizure / Epilepsy', sev: 'critical' },
      { key: 'febrile_seizure', icon: '🌡️', text: 'Febrile Seizure (Child)', sev: 'critical' },
      { key: 'stroke', icon: '🧠', text: 'Stroke', sev: 'critical' },
    ]
  },
  {
    id: 'allergy', icon: '⚠️', label: 'Allergy & Toxins', open: false,
    items: [
      { key: 'allergic', icon: '⚠️', text: 'Anaphylaxis', sev: 'critical' },
      { key: 'insect_sting', icon: '🐝', text: 'Insect Sting', sev: 'moderate' },
      { key: 'snake', icon: '🐍', text: 'Snake Bite', sev: 'critical' },
      { key: 'scorpion', icon: '🦂', text: 'Scorpion Sting', sev: 'critical' },
      { key: 'dog_bite', icon: '🐕', text: 'Animal / Dog Bite', sev: 'moderate' },
      { key: 'poisoning', icon: '☠️', text: 'Poisoning / Overdose', sev: 'critical' },
    ]
  },
  {
    id: 'medical', icon: '💊', label: 'Medical Emergencies', open: false,
    items: [
      { key: 'diabetic', icon: '🍬', text: 'Diabetic Emergency', sev: 'critical' },
      { key: 'fever', icon: '🌡️', text: 'Fever', sev: 'moderate' },
    ]
  },
  {
    id: 'pediatric', icon: '👶', label: 'Pediatric & Obstetric', open: false,
    items: [
      { key: 'infant_cpr', icon: '👶', text: 'Infant CPR (<1 yr)', sev: 'critical' },
      { key: 'emergency_birth', icon: '🤱', text: 'Emergency Childbirth', sev: 'critical' },
    ]
  },
];
