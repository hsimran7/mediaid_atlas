import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "MediAid Atlas",
      "nav": {
        "chatbot": "AI Medical Guide",
        "resources": "Knowledge Hub",
        "contribute": "Submit Remedy",
        "dashboard": "My Dashboard",
        "moderation": "Review Content",
        "users": "Manage Users",
        "title": "Navigation"
      },
      "common": {
        "login": "Sign In",
        "register": "Create Account",
        "logout": "Logout",
        "search": "Search for diseases, symptoms...",
        "upload": "Upload File",
        "submit": "Submit Now",
        "loading": "Please wait...",
        "verified": "Verified",
        "contributors": "Contributors",
        "critical": "Very Serious",
        "moderate": "Medium",
        "mild": "Small / Mild",
        "items": "items",
        "error_ai": "AI service is busy. Please try again or ask about basic first aid."
      },
      "tab": {
        "discover": "Discover",
        "saved": "Saved",
        "activity": "Activity"
      },
      "chat": {
        "welcome_desc": "Ask me anything about first aid. I can help you with emergency steps, treatments, and traditional remedies.",
        "tags": {
          "burns": "🔥 Burns",
          "cpr": "❤️ CPR",
          "choking": "😮‍💨 Choking",
          "bleeding": "🩸 Bleeding"
        }
      },
      "landing": {
        "tagline": "Medical Wisdom for Everyone",
        "f1": "Ask health questions in your language.",
        "f2": "Verified medical and traditional guides.",
        "f3": "Share your wisdom with the world."
      },
      "dashboard": {
        "welcome": "Welcome back, {{name}}",
        "subtitle": "Here is what is happening on your medical atlas today.",
        "stats": {
          "submissions": "Total Submissions",
          "verified": "My Verified Solutions",
          "pending": "Pending Review",
          "queries": "Queries"
        },
        "guidance_title": "What to do next?",
        "guide_1": "Search for any first aid treatment in the AI Assistant.",
        "guide_2": "Contribute a traditional remedy to help your community.",
        "guide_3": "Browse verified medical guides in the Knowledge Hub.",
        "quick_links": "Quick Actions"
      },
      "contribute": {
        "subtitle": "Add your medical report or traditional remedy here to help others.",
        "login_prompt": "Share your first aid knowledge and traditional remedies with your community.",
        "upload_btn": "Click to add files",
        "upload_hint": "You can select photos, videos or documents.",
        "form": {
          "title": "Name of the Treatment",
          "desc": "Explain how it works",
          "condition": "Which disease/emergency?",
          "severity": "How serious is it?",
          "files": "Add Photos or Videos (Max 10)"
        },
        "placeholders": {
          "title": "e.g., How to treat a small cut",
          "desc": "Write here in simple words..."
        },
        "guidance": {
          "title": "Helpful Tips",
          "tip1": "Use simple language that everyone can understand.",
          "tip2": "If you have a photo of the treatment, please add it.",
          "tip3": "Always mention if there are any side effects.",
          "tip4": "Be honest and helpful to your community."
        }
      },
      "resources": {
        "subtitle": "Curated first aid guides, videos, and traditional remedy references.",
        "filters": {
          "all": "ALL",
          "pdf": "PDF",
          "video": "VIDEO",
          "guide": "GUIDE",
          "home": "HOME REMEDIES"
        }
      }
    }
  },
  hi: {
    translation: {
      "app_name": "मिडिएड एटलस",
      "nav": {
        "chatbot": "एआई मेडिकल गाइड",
        "resources": "ज्ञान केंद्र",
        "contribute": "उपचार भेजें",
        "dashboard": "मेरा डैशबोर्ड",
        "moderation": "समीक्षा",
        "users": "उपयोगकर्ता",
        "title": "नेविगेशन"
      },
      "common": {
        "login": "साइन इन",
        "register": "खाता बनाएँ",
        "logout": "लॉगआउट",
        "search": "बीमारियों की खोज करें...",
        "upload": "फ़ाइल अपलोड करें",
        "submit": "अभी भेजें",
        "loading": "कृपया प्रतीक्षा करें...",
        "verified": "सत्यापित",
        "contributors": "योगदानकर्ता",
        "critical": "बहुत गंभीर",
        "moderate": "मध्यम",
        "mild": "हल्का / छोटा",
        "items": "चीजें",
        "error_ai": "एआई सेवा व्यस्त है। कृपया पुनः प्रयास करें या बुनियादी प्राथमिक चिकित्सा के बारे में पूछें।"
      },
      "tab": {
        "discover": "खोजें",
        "saved": "सहेजा गया",
        "activity": "गतिविधि"
      },
      "chat": {
        "welcome_desc": "मुझसे प्राथमिक चिकित्सा के बारे में कुछ भी पूछें। मैं आपातकालीन कदमों, उपचारों और पारंपरिक नुस्खों में आपकी मदद कर सकता हूँ।",
        "tags": {
          "burns": "🔥 जलन",
          "cpr": "❤️ सीपीआर",
          "choking": "😮‍💨 दम घुटना",
          "bleeding": "🩸 रक्तस्राव"
        }
      },
      "landing": {
        "tagline": "सभी के लिए चिकित्सा ज्ञान",
        "f1": "अपनी भाषा में स्वास्थ्य संबंधी प्रश्न पूछें।",
        "f2": "सत्यापित चिकित्सा और पारंपरिक गाइड।",
        "f3": "अपना ज्ञान दुनिया के साथ साझा करें।"
      },
      "dashboard": {
        "welcome": "स्वागत है, {{name}}",
        "subtitle": "आज आपके मेडिकल एटलस में क्या हो रहा है, यहाँ देखें।",
        "stats": {
          "submissions": "कुल सबमिशन",
          "verified": "मेरे सत्यापित समाधान",
          "pending": "समीक्षा बाकी है",
          "queries": "प्रश्न"
        },
        "guidance_title": "अब आगे क्या करें?",
        "guide_1": "एआई सहायक में किसी भी प्राथमिक उपचार की खोज करें।",
        "guide_2": "अपने समुदाय की मदद के लिए एक पारंपरिक उपचार भेजें।",
        "guide_3": "ज्ञान केंद्र में सत्यापित चिकित्सा गाइड देखें।",
        "quick_links": "त्वरित लिंक"
      },
      "contribute": {
        "subtitle": "दूसरों की मदद करने के लिए अपनी मेडिकल रिपोर्ट या उपचार यहाँ जोड़ें।",
        "login_prompt": "अपने समुदाय के साथ प्राथमिक उपचार और पारंपरिक नुस्खे साझा करें।",
        "upload_btn": "फ़ाइलें जोड़ने के लिए क्लिक करें",
        "upload_hint": "आप फोटो, वीडियो या दस्तावेਜ਼ चुन सकते हैं।",
        "form": {
          "title": "उपचार का नाम",
          "desc": "बताएं कि यह कैसे काम करता है",
          "condition": "कौन सी बीमारी/आपातकाल?",
          "severity": "यह कितना गंभीर है?",
          "files": "फोटो या वीडियो जोड़ें (अधिकतम 10)"
        },
        "placeholders": {
          "title": "जैसे: छोटे कट का इलाज कैसे करें",
          "desc": "यहाँ सरल शब्दों में लिखें..."
        },
        "guidance": {
          "title": "मददगार सुझाव",
          "tip1": "ऐसी सरल भाषा का प्रयोग करें जिसे हर कोई समझ सके।",
          "tip2": "यदि आपके पास उपचार की फोटो है, तो कृपया उसे जोड़ें।",
          "tip3": "हमेशा उल्लेख करें कि क्या कोई दुष्प्रभाव (साइड इफेक्ट) हैं।",
          "tip4": "अपने समुदाय के प्रति ईमानदार और मददगार रहें।"
        }
      },
      "resources": {
        "subtitle": "प्राथमिक चिकित्सा गाइड, वीडियो और पारंपरिक उपचार संदर्भों का संग्रह।",
        "filters": {
          "all": "सभी",
          "pdf": "पीडीएफ",
          "video": "वीडियो",
          "guide": "गाइड",
          "home": "घरेलू उपचार"
        }
      }
    }
  },
  pa: {
    translation: {
      "app_name": "ਮੀਡੀਏਡ ਐਟਲਸ",
      "nav": {
        "chatbot": "ਏਆਈ ਮੈਡੀਕਲ ਗਾਈਡ",
        "resources": "ਗਿਆਨ ਕੇਂਦਰ",
        "contribute": "ਇਲਾਜ ਭੇਜੋ",
        "dashboard": "ਮੇਰਾ ਡੈਸ਼ਬੋਰਡ",
        "moderation": "ਸਮੀਖਿਆ",
        "users": "ਉਪਭੋਗਤਾ",
        "title": "ਨੇਵੀਗੇਸ਼ਨ"
      },
      "common": {
        "login": "ਸਾਈਨ ਇਨ",
        "register": "ਖਾਤਾ ਬਣਾਓ",
        "logout": "ਲੌਗਆਊਟ",
        "search": "ਬਿਮਾਰੀਆਂ ਦੀ ਖੋਜ ਕਰੋ...",
        "upload": "ਫਾਈਲ ਅਪਲੋਡ ਕਰੋ",
        "submit": "ਹੁਣੇ ਭੇਜੋ",
        "loading": "ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ...",
        "verified": "ਤਸਦੀਕ",
        "contributors": "ਯੋਗਦਾਨੀ",
        "critical": "ਬਹੁਤ ਗੰਭੀਰ",
        "moderate": "ਦਰਮਿਆਨਾ",
        "mild": "ਹਲਕਾ / ਛੋਟਾ",
        "items": "ਵਸਤੂਆਂ",
        "error_ai": "ਏਆਈ ਸੇਵਾ ਰੁੱਝੀ ਹੋਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਮੁਢਲੀ ਸਹਾਇਤਾ ਬਾਰੇ ਪੁੱਛੋ।"
      },
      "tab": {
        "discover": "ਖੋਜੋ",
        "saved": "ਸੰਭਾਲਿਆ",
        "activity": "ਗਤੀਵਿਧੀ"
      },
      "chat": {
        "welcome_desc": "ਮੈਨੂੰ ਮੁਢਲੀ ਸਹਾਇਤਾ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ। ਮੈਂ ਐਮਰਜੈਂਸੀ ਕਦਮਾਂ, ਇਲਾਜਾਂ ਅਤੇ ਰਵਾਇਤੀ ਨੁਸਖਿਆਂ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
        "tags": {
          "burns": "🔥 ਜਲਣਾ",
          "cpr": "❤️ ਸੀਪੀਆਰ",
          "choking": "😮‍💨 ਸਾਹ ਰੁਕਣਾ",
          "bleeding": "🩸 ਖੂਨ ਵਗਣਾ"
        }
      },
      "landing": {
        "tagline": "ਸਾਰਿਆਂ ਲਈ ਮੈਡੀਕਲ ਗਿਆਨ",
        "f1": "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਿਹਤ ਸੰਬੰਧੀ ਸਵਾਲ ਪੁੱਛੋ।",
        "f2": "ਤਸਦੀਕਸ਼ੁਦਾ ਮੈਡੀਕਲ ਅਤੇ ਰਵਾਇਤੀ ਗਾਈਡਾਂ।",
        "f3": "ਆਪਣਾ ਗਿਆਨ ਦੁਨੀਆ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।"
      },
      "dashboard": {
        "welcome": "ਜੀ ਆਇਆਂ ਨੂੰ, {{name}}",
        "subtitle": "ਅੱਜ ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਐਟਲਸ ਵਿੱਚ ਕੀ ਹੋ ਰਿਹਾ ਹੈ, ਇੱਥੇ ਦੇਖੋ।",
        "stats": {
          "submissions": "ਕੁੱਲ ਸਬਮਿਸ਼ਨ",
          "verified": "ਮੇਰੇ ਤਸਦੀਕਸ਼ੁਦਾ ਇਲਾਜ",
          "pending": "ਸਮੀਖਿਆ ਬਾਕੀ",
          "queries": "ਸਵਾਲ"
        },
        "guidance_title": "ਹੁਣ ਅੱਗੇ ਕੀ ਕਰੀਏ?",
        "guide_1": "ਏਆਈ ਸਹਾਇਕ ਵਿੱਚ ਕਿਸੇ ਵੀ ਮੁਢਲੀ ਸਹਾਇਤਾ ਦੀ ਖੋਜ ਕਰੋ।",
        "guide_2": "ਆਪਣੇ ਭਾਈਚਾਰੇ ਦੀ ਮਦਦ ਲਈ ਇੱਕ ਰਵਾਇਤੀ ਇਲਾਜ ਭੇਜੋ।",
        "guide_3": "ਗਿਆਨ ਕੇਂਦਰ ਵਿੱਚ ਤਸਦੀਕਸ਼ੁਦਾ ਮੈਡੀਕਲ ਗਾਈਡਾਂ ਦੇਖੋ।",
        "quick_links": "ਤੁਰੰਤ ਲਿੰਕ"
      },
      "contribute": {
        "subtitle": "ਦੂਜਿਆਂ ਦੀ ਮਦਦ ਲਈ ਆਪਣੀ ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਜਾਂ ਇਲਾਜ ਇੱਥੇ ਸ਼ਾਮਲ ਕਰੋ।",
        "login_prompt": "ਆਪਣੇ ਭਾਈਚਾਰੇ ਨਾਲ ਮੁਢਲੀ ਸਹਾਇਤਾ ਅਤੇ ਰਵਾਇਤੀ ਨੁਸਖੇ ਸਾਂਝੇ ਕਰੋ।",
        "upload_btn": "ਫਾਈਲਾਂ ਜੋੜਨ ਲਈ ਕਲਿੱਕ ਕਰੋ",
        "upload_hint": "ਤੁਸੀਂ ਫੋਟੋਆਂ, ਵੀਡੀਓ ਜਾਂ ਦਸਤਾਵੇਜ਼ ਚੁਣ ਸਕਦੇ ਹੋ।",
        "form": {
          "title": "ਇਲਾਜ ਦਾ ਨਾਮ",
          "desc": "ਦੱਸੋ ਕਿ ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
          "condition": "ਕਿਹੜੀ ਬਿਮਾਰੀ/ਐਮਰਜੈਂਸੀ?",
          "severity": "ਇਹ ਕਿੰਨਾ ਗੰਭੀਰ ਹੈ?",
          "files": "ਫੋਟੋਆਂ ਜਾਂ ਵੀਡੀਓ ਜੋੜੋ (ਵੱਧ ਤੋਂ ਵੱਧ 10)"
        },
        "placeholders": {
          "title": "ਜਿਵੇਂ: ਛੋਟੇ ਕੱਟ ਦਾ ਇਲਾਜ ਕਿਵੇਂ ਕਰੀਏ",
          "desc": "ਇੱਥੇ ਸਰਲ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖੋ..."
        },
        "guidance": {
          "title": "ਮਦਦਗਾਰ ਸੁਝਾਅ",
          "tip1": "ਅਜਿਹੀ ਸਰਲ ਭਾਸ਼ਾ ਦੀ ਵਰਤੋਂ ਕਰੋ ਜੋ ਹਰ ਕੋਈ ਸਮਝ ਸਕੇ।",
          "tip2": "ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਇਲਾਜ ਦੀ ਫੋਟੋ ਹੈ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਸ਼ਾਮਲ ਕਰੋ।",
          "tip3": "ਹਮੇਸ਼ਾ ਦੱਸੋ ਜੇਕਰ ਕੋਈ ਮਾੜੇ ਪ੍ਰਭਾਵ (ਸਾਈਡ ਇਫੈਕਟ) ਹਨ।",
          "tip4": "ਆਪਣੇ ਭਾਈਚਾਰੇ ਪ੍ਰਤੀ ਇਮਾਨਦਾਰ ਅਤੇ ਮਦਦਗਾਰ ਰਹੋ।"
        }
      },
      "resources": {
        "subtitle": "ਮੁਢਲੀ ਸਹਾਇਤਾ ਗਾਈਡਾਂ, ਵੀਡੀਓਜ਼ ਅਤੇ ਰਵਾਇਤੀ ਇਲਾਜਾਂ ਦਾ ਸੰਗ੍ਰਹਿ।",
        "filters": {
          "all": "ਸਾਰੇ",
          "pdf": "ਪੀਡੀਐਫ",
          "video": "ਵੀਡੀਓ",
          "guide": "ਗਾਈਡ",
          "home": "ਘਰੇਲੂ ਇਲਾਜ"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
