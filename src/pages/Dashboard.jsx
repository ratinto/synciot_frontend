import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, sensorService, alertService, roverService } from '../services/authService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, Wifi, AlertCircle, Gauge, RefreshCw, LogOut, Loader, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 mr-3">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
        </div>
        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">{value}</p>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">{subtitle}</p>
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
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">IoT Rover Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time monitoring and control system</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh dashboard"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
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
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Stats Grid - 4 Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
            {/* Sensor Trends Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Sensor Trends</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Temperature and humidity (30 days)</p>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
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
                  <p className="text-gray-500 text-sm">No chart data available</p>
                </div>
              )}
            </div>

            {/* Battery Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Battery Status</h2>
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto pr-2">
                {rovers.length > 0 ? (
                  rovers.map((rover) => (
                    <div key={rover.id} className="space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{rover.name}</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 flex-shrink-0">{rover.battery}%</span>
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
                        className={`inline-block text-xs px-2 py-1 rounded font-medium ${
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
                  <p className="text-gray-500 text-center py-8 text-sm">No rovers available</p>
                )}
              </div>
            </div>
          </div>

          {/* Rovers & Alerts Section - Equal split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rovers Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Rovers Status</h2>
              <div className="space-y-2 sm:space-y-3 max-h-72 overflow-y-auto pr-2">
                {rovers.length > 0 ? (
                  rovers.map((rover) => (
                    <div key={rover.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{rover.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
                          {rover.pendingCommands || 0} cmds • {rover.activeAlerts || 0} alerts
                        </p>
                      </div>
                      <span
                        className={`ml-1 inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 whitespace-nowrap ${
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
                  <p className="text-gray-500 text-center py-8 text-sm">No rovers available</p>
                )}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Alerts</h2>
              <div className="space-y-2 sm:space-y-3 max-h-72 overflow-y-auto pr-2">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2 sm:p-3 rounded-lg border-l-4 ${
                        alert.severity === 'critical'
                          ? 'bg-red-50 border-red-500'
                          : alert.severity === 'warning'
                          ? 'bg-yellow-50 border-yellow-500'
                          : 'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm leading-snug">{alert.message}</p>
                          <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 truncate">{alert.rover?.name}</p>
                        </div>
                        <span
                          className={`ml-1 inline-block px-2 py-0.5 text-xs font-semibold rounded flex-shrink-0 whitespace-nowrap ${
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
                  <p className="text-gray-500 text-center py-8 text-sm">No active alerts</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-gray-500 pt-4">
            <p>Last updated: {today}</p>
          </div>
          </div>
        </main>
      )}
    </div>
  );
};
