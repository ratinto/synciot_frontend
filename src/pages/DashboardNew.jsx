import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { robotService } from '../services/api';
import { 
  Plus, 
  RefreshCw, 
  LogOut, 
  Loader, 
  Wifi, 
  WifiOff,
  Battery,
  Activity,
  Trash2,
  Edit,
  Eye,
  Search,
  X
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [robots, setRobots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Search, Filter, Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'online', 'offline'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const fetchRobots = async () => {
    try {
      setError(null);
      const response = await robotService.getAllRobots();
      if (response?.success && response?.data) {
        setRobots(response.data);
      }
    } catch (err) {
      console.error('Error fetching robots:', err);
      setError('Failed to load robots');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRobots();
    
    // Auto-refresh every 10 seconds to get latest robot status
    const interval = setInterval(() => {
      fetchRobots();
    }, 10000); // Refresh every 10 seconds
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRobots();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewRobot = (robotId) => {
    navigate(`/robot/${robotId}`);
  };

  const handleAddRobot = () => {
    navigate('/robot/add');
  };

  const getBatteryColor = (battery) => {
    if (battery > 60) return 'bg-green-500';
    if (battery > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'offline': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Filter, Search, and Sort Logic
  const getFilteredAndSortedRobots = () => {
    let filtered = [...robots];

    // 1. Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(robot => robot.status === statusFilter);
    }

    // 2. Search by name
    if (searchQuery.trim()) {
      filtered = filtered.filter(robot =>
        robot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Sort by name
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  };

  const filteredRobots = getFilteredAndSortedRobots();

  // Calculate statistics (from original robots, not filtered)
  const stats = {
    total: robots.length,
    online: robots.filter(r => r.status === 'online').length,
    offline: robots.filter(r => r.status === 'offline').length,
    avgBattery: robots.length > 0 
      ? Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / robots.length)
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">IoT Robot Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time robot monitoring and control system</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
            <p className="text-gray-600">Loading robots...</p>
          </div>
        </div>
      ) : (
        <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Robots</p>
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Online</p>
                  <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.online}</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Offline</p>
                  <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.offline}</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Avg Battery</p>
                  <Battery className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.avgBattery}%</p>
              </div>
            </div>

            {/* Search, Filter, Sort Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search robots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="online">Online Only</option>
                    <option value="offline">Offline Only</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="asc">Name: A → Z</option>
                    <option value="desc">Name: Z → A</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || statusFilter !== 'all') && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {filteredRobots.length} of {robots.length} robots</span>
                  {(searchQuery || statusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Add Robot Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Robots</h2>
              <button
                onClick={handleAddRobot}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Robot</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {/* Robots Grid */}
            {filteredRobots.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {robots.length === 0 ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Robots Yet</h3>
                    <p className="text-gray-500 mb-4">Get started by adding your first robot</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Robots Found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  </>
                )}
                <button
                  onClick={handleAddRobot}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Robot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredRobots.map((robot) => (
                  <div
                    key={robot.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Robot Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{robot.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(robot.lastSeen).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(robot.status)}`}>
                          {robot.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Battery */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Battery</span>
                          <span className="text-sm font-bold text-gray-900">{robot.battery}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getBatteryColor(robot.battery)}`}
                            style={{ width: `${robot.battery}%` }}
                          />
                        </div>
                      </div>

                      {/* Sensors Count */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sensors</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {robot._count?.sensors || 0} connected
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewRobot(robot.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
