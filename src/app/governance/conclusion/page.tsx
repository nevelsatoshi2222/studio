// src/app/governance/conclusion/page.tsx
'use client';
import { useState } from 'react';

export default function Conclusion() {
  const [language, setLanguage] = useState('english');
  
  const content = {
    english: {
      title: "Complete Governance Journey",
      message: "You've explored global challenges and India-specific solutions"
    },
    hindi: {
      title: "संपूर्ण शासन यात्रा",
      message: "आपने वैश्विक चुनौतियों और भारत-विशिष्ट समाधानों का अन्वेषण किया"
    }
  };
  
  const current = content[language as keyof typeof content];
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <button 
          onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
          className="bg-gray-200 px-4 py-2 rounded mb-4"
        >
          {language === 'english' ? 'हिंदी' : 'English'}
        </button>
        <h1 className="text-4xl font-bold">{current.title}</h1>
        <p className="text-xl mt-4">{current.message}</p>
      </div>
    </div>
  );
}