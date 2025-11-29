"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useHealthPlatform } from "./health";
import { type SupportedLanguage, type UserRole, ROLE_NAMES } from "@/lib/health-platform";

const GREETINGS: Record<SupportedLanguage, {
  hello: string;
  welcome: string;
  askHealth: string;
}> = {
  en: {
    hello: "Hello!",
    welcome: "Welcome to the Health Assistant",
    askHealth: "Ask me about health, diseases, vaccines, or government schemes.",
  },
  hi: {
    hello: "नमस्ते!",
    welcome: "स्वास्थ्य सहायक में आपका स्वागत है",
    askHealth: "मुझसे स्वास्थ्य, बीमारियों, टीकों या सरकारी योजनाओं के बारे में पूछें।",
  },
  mr: {
    hello: "नमस्कार!",
    welcome: "आरोग्य सहाय्यकात आपले स्वागत आहे",
    askHealth: "मला आरोग्य, रोग, लसी किंवा सरकारी योजनांबद्दल विचारा।",
  },
  pa: {
    hello: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ!",
    welcome: "ਸਿਹਤ ਸਹਾਇਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    askHealth: "ਮੈਨੂੰ ਸਿਹਤ, ਬਿਮਾਰੀਆਂ, ਟੀਕਿਆਂ ਜਾਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
  },
};

const ROLE_TIPS: Record<UserRole, Record<SupportedLanguage, string>> = {
  citizen: {
    en: "💡 Try: \"What are the symptoms of dengue?\" or \"Which vaccines does my baby need?\"",
    hi: "💡 कोशिश करें: \"डेंगू के लक्षण क्या हैं?\" या \"मेरे बच्चे को कौन से टीके चाहिए?\"",
    mr: "💡 प्रयत्न करा: \"डेंग्यूची लक्षणे कोणती?\" किंवा \"माझ्या बाळाला कोणत्या लसी हव्या?\"",
    pa: "💡 ਕੋਸ਼ਿਸ਼ ਕਰੋ: \"ਡੇਂਗੂ ਦੇ ਲੱਛਣ ਕੀ ਹਨ?\" ਜਾਂ \"ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਕਿਹੜੇ ਟੀਕੇ ਚਾਹੀਦੇ ਹਨ?\"",
  },
  asha: {
    en: "💡 Try: \"Show vaccine schedule\" or \"Risk assessment for pregnant woman\"",
    hi: "💡 कोशिश करें: \"टीकाकरण अनुसूची दिखाएं\" या \"गर्भवती महिला के लिए जोखिम मूल्यांकन\"",
    mr: "💡 प्रयत्न करा: \"लसीकरण वेळापत्रक दाखवा\" किंवा \"गरोदर महिलेसाठी जोखीम मूल्यांकन\"",
    pa: "💡 ਕੋਸ਼ਿਸ਼ ਕਰੋ: \"ਟੀਕਾਕਰਨ ਅਨੁਸੂਚੀ ਦਿਖਾਓ\" ਜਾਂ \"ਗਰਭਵਤੀ ਔਰਤ ਲਈ ਜੋਖਮ ਮੁਲਾਂਕਣ\"",
  },
  officer: {
    en: "💡 Try: \"Disease outbreak trends\" or \"Health scheme utilization report\"",
    hi: "💡 कोशिश करें: \"रोग प्रकोप के रुझान\" या \"स्वास्थ्य योजना उपयोग रिपोर्ट\"",
    mr: "💡 प्रयत्न करा: \"रोग उद्रेक ट्रेंड\" किंवा \"आरोग्य योजना वापर अहवाल\"",
    pa: "💡 ਕੋਸ਼ਿਸ਼ ਕਰੋ: \"ਬਿਮਾਰੀ ਫੈਲਣ ਦੇ ਰੁਝਾਨ\" ਜਾਂ \"ਸਿਹਤ ਯੋਜਨਾ ਵਰਤੋਂ ਰਿਪੋਰਟ\"",
  },
};

export const Greeting = () => {
  const { language, role } = useHealthPlatform();
  const greeting = GREETINGS[language];
  const roleTip = ROLE_TIPS[role][language];
  const roleName = ROLE_NAMES[role][language];

  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
      key="overview"
    >
      {/* Health Icon */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4 flex items-center gap-3"
        exit={{ opacity: 0, scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
          {roleName}
        </span>
      </motion.div>

      {/* Greeting */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        {greeting.hello}
      </motion.div>
      
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-zinc-500 md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        {greeting.welcome}
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-base text-muted-foreground"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
      >
        {greeting.askHealth}
      </motion.div>

      {/* Role-specific tip */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.8 }}
      >
        {roleTip}
      </motion.div>
    </div>
  );
};
