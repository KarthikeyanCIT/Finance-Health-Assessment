import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "overview": "Overview",
                "analytics": "Analytics",
                "compliance": "Compliance",
                "upload": "Data Upload",
                "settings": "Settings",
                "signout": "Sign Out"
            },
            "dashboard": {
                "title": "Financial Hub",
                "welcome": "Welcome back, Chief Financial Officer",
                "health_index": "Health Index",
                "liquidity": "Liquidity",
                "burn_rate": "Burn Rate",
                "ai_recommendation": "AI Recommendation",
                "insights": "Critical Insights",
                "export_report": "Export PDF"
            }
        }
    },
    hi: {
        translation: {
            "nav": {
                "overview": "सिंहावलोकन",
                "analytics": "विश्लेषण",
                "compliance": "अनुपालन",
                "upload": "डेटा अपलोड",
                "settings": "समायोजन",
                "signout": "साइन आउट"
            },
            "dashboard": {
                "title": "वित्तीय केंद्र",
                "welcome": "वापसी पर स्वागत है, मुख्य वित्तीय अधिकारी",
                "health_index": "स्वास्थ्य सूचकांक",
                "liquidity": "तरलता",
                "burn_rate": "व्यय दर",
                "ai_recommendation": "एआई सिफारिश",
                "insights": "महत्वपूर्ण अंतर्दृष्टि",
                "export_report": "पीडीएफ निर्यात"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
