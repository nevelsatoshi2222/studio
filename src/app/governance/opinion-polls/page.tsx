// src/app/governance/opinion-polls/page.tsx
'use client';

export default function OpinionPolls() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">🗳️ Governance Opinion Polls</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">International Army Concept</h3>
          <p>Should we have one global security force?</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Vote Now
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Education Reform</h3>
          <p>60% Practical + 40% Theory - Support?</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Vote Now
          </button>
        </div>
      </div>
    </div>
  );
}