import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IoT Rover Control</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, <span className="font-semibold">{user?.name}</span></span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rover Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Rover Status</h2>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Battery:</span> 85%
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Connection:</span> Connected
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Uptime:</span> 2h 45m
              </p>
            </div>
          </div>

          {/* Sensor Data Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sensor Data</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Temperature:</span> 26.5°C
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Humidity:</span> 61.2%
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Distance:</span> 28.4m
              </p>
            </div>
          </div>

          {/* Controls Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Control</h2>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="text-sm">↑ Forward</Button>
              <Button variant="outline" disabled className="text-sm">❌</Button>
              <Button variant="outline" className="text-sm">⏹ Stop</Button>
              <Button variant="outline" className="text-sm">← Left</Button>
              <Button variant="outline" disabled className="text-sm">↓ Back</Button>
              <Button variant="outline" className="text-sm">Right →</Button>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🚀 More Features Coming Soon</h2>
          <p className="text-gray-600">Live video streaming, advanced controls, and data analytics</p>
        </div>
      </div>
    </div>
  );
};
