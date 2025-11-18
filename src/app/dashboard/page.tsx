'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <p className="text-gray-600">Welcome to your dashboard</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <p className="text-gray-600">Your recent activities will appear here</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-gray-600">No new notifications</p>
        </div>
      </div>
    </div>
  );
}