// src/app/governance/world-perspective/page.tsx
'use client';
import { useState } from 'react';

export default function WorldPerspective() {
  const [activeSection, setActiveSection] = useState('overview');
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">🌍 World Perspective</h1>
      
      {/* Add the world perspective content from our previous discussion */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Global Defense Spending</h3>
          <p>$2.2 trillion annually - could end world hunger 42 times over</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">International Peace Solutions</h3>
          <p>UN 2.0, Global Army, Cooperation Models</p>
        </div>
      </div>
    </div>
  );
}