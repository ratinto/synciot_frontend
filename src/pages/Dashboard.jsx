import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, sensorService, alertService, roverService } from '../services/authService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, Wifi, AlertCircle, Gauge, RefreshCw, LogOut, Loader, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0 ml-4">
        <Icon className="w-6 h-6 text-blue-600" />
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

  // Data states with fallback values
  const [stats, setStats] = useState({
    activeRovers: 0,
    totalReadings: 0,
    avgBattery: 0,
    activeAlerts: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [rovers, setRovers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const fetchData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Fetch dashboard stats with error handling
      try {
        const statsRes = await dashboardService.getDashboardStats();
        if (statsRes?.data?.overview) {
          setStats({
            activeRovers: statsRes.data.overview.activeRovers || 0,
            totalReadings: statsRes.data.overview.totalReadings || 0,
            avgBattery: statsRes.data.overview.avgBattery || 0,
            activeAlerts: statsRes.data.alerts?.active || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }

      // Fetch sensor data
      try {
        const sensorRes = await sensorService.getSensorStats({ days: 30 });
        if (sensorRes?.data?.chartData) {
          setChartData(sensorRes.data.chartData);
        }
      } catch (err) {
        console.error('Error fetching sensor data:', err);
      }

      // Fetch rovers
      try {
        const roversRes = await roverService.getAllRovers();
        if (roversRes?.data) {
          setRovers(roversRes.data);
        }
      } catch (err) {
        console.error('Error fetching rovers:', err);
      }

      // Fetch alerts
      try {
        const alertsRes = await alertService.getAlerts({ limit: 5 });
        if (alertsRes?.data) {
          setAlerts(alertsRes.data);
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
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
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">IoT Rover Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time monitoring and control system</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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

      {/* Error Banner */}
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid - 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Wifi}
              title="Active Rovers"
              value={stats.activeRovers}
              subtitle="Online rovers"
            />
            <StatCard
              icon={Gauge}
              title="Total Readings"
              value={stats.totalReadings.toLocaleString()}
              subtitle="Sensor data points"
            />
            <StatCard
              icon={Zap}
              title="Avg Battery"
              value={`${stats.avgBattery}%`}
              subtitle="Across all rovers"
            />
            <StatCard
              icon={AlertCircle}
              title="Active Alerts"
              value={stats.activeAlerts}
              subtitle="Critical alerts"
            />
          </div>

          {/* Charts Section - 2/3 and 1/3 split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sensor Trends Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Sensor Trends</h2>
                <p className="text-sm text-gray-500">Temperature and humidity (30 days)</p>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      name="Temp (°C)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      name="Humidity (%)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded">
                  <p className="text-gray-500">No chart data available</p>
                </div>
              )}
            </div>

            {/* Battery Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Battery Status</h2>
              <div className="space-y-4">
                {rovers.length > 0 ? (
                  rovers.map((rover) => (
                    <div key={rover.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{rover.name}</span>
                        <span className="text-sm font-bold text-gray-900">{rover.battery}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            rover.battery > 60
                              ? 'bg-green-500'
                              : rover.battery > 30
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${rover.battery}%` }}
                        ></div>
                      </div>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded ${
                          rover.status === 'online'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rover.status.toUpperCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No rovers available</p>
                )}
              </div>
            </div>
          </div>

          {/* Rovers & Alerts Section - Equal split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Rovers Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rovers Status</h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {rovers.length > 0 ? (
                  rovers.map((rover) => (
                    <div key={rover.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{rover.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {rover.pendingCommands || 0} commands • {rover.activeAlerts || 0} alerts
                        </p>
                      </div>
                      <span
                        className={`ml-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          rover.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : rover.status === 'offline'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rover.status.charAt(0).toUpperCase() + rover.status.slice(1)}
                      </span>
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
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
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
                        <span
                          className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded flex-shrink-0 ${
                            alert.severity === 'critical'
                              ? 'bg-red-200 text-red-800'
                              : alert.severity === 'warning'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}
                        >
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
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

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Last updated: {today}</p>
          </div>
        </main>
      )}
    </div>
  );
};
