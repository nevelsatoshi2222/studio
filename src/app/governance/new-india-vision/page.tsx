// src/app/governance/new-india-vision/page.tsx
'use client';

export default function NewIndiaVision() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">🇮🇳 New India Vision</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">भ्रष्टाचार मिटावो सेना</h3>
          <p>Corruption Elimination Army with public participation</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">शिक्षा क्रांति</h3>
          <p>60% Practical + 40% Theory Education System</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">हर घर रोजगार</h3>
          <p>Employment for every household</p>
        </div>
      </div>
    </div>
  );
}