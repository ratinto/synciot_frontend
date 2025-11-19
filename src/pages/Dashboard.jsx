import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, sensorService, alertService, roverService } from '../services/authService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Zap, Wifi, AlertCircle, Gauge, RefreshCw, LogOut, Loader } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, className = '', trend = null }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        {trend && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
      <div className="p-3 bg-gray-100 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sensorStats, setSensorStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [rovers, setRovers] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Fetch dashboard stats
      const statsRes = await dashboardService.getDashboardStats();
      setDashboardStats(statsRes.data);

      // Fetch sensor statistics (last 30 days)
      const sensorRes = await sensorService.getSensorStats({ days: 30 });
      setSensorStats(sensorRes.data);

      // Fetch recent alerts
      const alertsRes = await alertService.getAlerts({ limit: 5, isResolved: false });
      setRecentAlerts(alertsRes.data);

      // Fetch all rovers
      const roversRes = await roverService.getAllRovers();
      setRovers(roversRes.data);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IoT Rover Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time monitoring and control system</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Wifi}
            title="Active Rovers"
            value={dashboardStats?.overview?.activeRovers || 0}
            subtitle={`of ${dashboardStats?.overview?.totalRovers || 0} rovers online`}
          />
          <StatCard
            icon={Gauge}
            title="Total Readings"
            value={(dashboardStats?.overview?.totalReadings || 0).toLocaleString()}
            subtitle="Sensor data points"
          />
          <StatCard
            icon={Zap}
            title="Average Battery"
            value={`${dashboardStats?.overview?.avgBattery || 0}%`}
            subtitle="Across all rovers"
          />
          <StatCard
            icon={AlertCircle}
            title="Active Alerts"
            value={dashboardStats?.alerts?.active || 0}
            subtitle={`${dashboardStats?.alerts?.critical || 0} critical`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Temperature & Humidity Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Sensor Trends (30 Days)</h2>
              <p className="text-sm text-gray-500">Temperature and humidity over time</p>
            </div>
            {sensorStats?.chartData && sensorStats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sensorStats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" strokeWidth={2} />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          {/* Battery Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Battery Status</h2>
              <p className="text-sm text-gray-500">Current rover battery levels</p>
            </div>
            <div className="space-y-4">
              {rovers.length > 0 ? (
                rovers.map((rover) => (
                  <div key={rover.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{rover.name}</p>
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          rover.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            rover.battery > 50
                              ? 'bg-green-500'
                              : rover.battery > 20
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${rover.battery}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="ml-4 text-sm font-semibold text-gray-900">{rover.battery}%</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No rovers available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Commands & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Rovers Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rovers Status</h2>
            <p className="text-sm text-gray-500 mb-4">Current state of all rovers</p>
            <div className="space-y-3">
              {rovers.length > 0 ? (
                rovers.map((rover) => (
                  <div key={rover.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{rover.name}</p>
                      <p className="text-xs text-gray-500">
                        {rover.pendingCommands} pending • {rover.activeAlerts} alerts
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        rover.status === 'online'
                          ? 'bg-green-100 text-green-800'
                          : rover.status === 'offline'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rover.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No rovers available</p>
              )}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
            <p className="text-sm text-gray-500 mb-4">Active system alerts</p>
            <div className="space-y-3">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.rover?.name}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                        alert.severity === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No active alerts</p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sensor Statistics</h2>
          <p className="text-sm text-gray-500 mb-6">Summary of sensor readings from the last 30 days</p>
          
          {sensorStats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sensorStats.avgTemperature}°C</p>
                <p className="text-xs text-gray-600 mt-1">Avg Temperature</p>
                <p className="text-xs text-gray-500">
                  {sensorStats.minTemperature}° - {sensorStats.maxTemperature}°
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sensorStats.avgHumidity}%</p>
                <p className="text-xs text-gray-600 mt-1">Avg Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sensorStats.avgDistance}m</p>
                <p className="text-xs text-gray-600 mt-1">Avg Distance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sensorStats.avgBattery}%</p>
                <p className="text-xs text-gray-600 mt-1">Avg Battery</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sensorStats.totalReadings}</p>
                <p className="text-xs text-gray-600 mt-1">Total Readings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sensorStats.avgSignalStrength}</p>
                <p className="text-xs text-gray-600 mt-1">Signal (dBm)</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No statistics available</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {today}</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
