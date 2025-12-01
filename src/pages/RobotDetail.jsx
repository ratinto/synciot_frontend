import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { robotService, sensorService } from '../services/api';
import { 
  ArrowLeft, 
  RefreshCw, 
  Plus, 
  Loader,
  Wifi,
  WifiOff,
  Battery,
  Thermometer,
  Droplets,
  Ruler,
  Signal,
  Gauge,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  distance: Ruler,
  battery: Battery,
  signal: Signal,
  pressure: Gauge,
  light: Activity,
};

export const RobotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [robot, setRobot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showAddSensor, setShowAddSensor] = useState(false);

  const fetchRobotDetails = async () => {
    try {
      setError(null);
      const response = await robotService.getRobotById(id);
      if (response?.success && response?.data) {
        setRobot(response.data);
      }
    } catch (err) {
      console.error('Error fetching robot details:', err);
      setError('Failed to load robot details');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRobotDetails();
  }, [id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRobotDetails();
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDeleteSensor = async (sensorId) => {
    if (!confirm('Are you sure you want to delete this sensor?')) return;
    
    try {
      await sensorService.deleteSensor(sensorId);
      fetchRobotDetails(); // Refresh data
    } catch (err) {
      console.error('Error deleting sensor:', err);
      alert('Failed to delete sensor');
    }
  };

  const handleUpdateRobot = () => {
    navigate(`/robot/${id}/edit`);
  };

  const handleDeleteRobot = async () => {
    if (!confirm('Are you sure you want to delete this robot? All sensors will be deleted too.')) return;
    
    try {
      await robotService.deleteRobot(id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting robot:', err);
      alert('Failed to delete robot');
    }
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

  const getSensorIcon = (type) => {
    const Icon = sensorIcons[type] || Activity;
    return Icon;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading robot details...</p>
        </div>
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Robot not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{robot.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Robot Details & Sensors</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Robot Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{robot.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Last seen: {new Date(robot.lastSeen).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateRobot}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteRobot}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(robot.status)}`}>
                {robot.status === 'online' ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
                {robot.status.toUpperCase()}
              </span>
            </div>

            {/* Battery */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Battery Level</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getBatteryColor(robot.battery)}`}
                      style={{ width: `${robot.battery}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-12">{robot.battery}%</span>
              </div>
            </div>

            {/* Sensors Count */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Connected Sensors</p>
              <p className="text-2xl font-bold text-gray-900">{robot.sensors?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Sensors Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Sensors</h2>
            <button
              onClick={() => navigate(`/robot/${id}/add-sensor`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Sensor
            </button>
          </div>

          {robot.sensors?.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sensors Yet</h3>
              <p className="text-gray-500 mb-4">Add sensors to monitor this robot</p>
              <button
                onClick={() => navigate(`/robot/${id}/add-sensor`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Sensor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {robot.sensors.map((sensor) => {
                const Icon = getSensorIcon(sensor.type);
                return (
                  <div key={sensor.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                          <p className="text-xs text-gray-500">{sensor.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-3xl font-bold text-gray-900">
                        {sensor.value} <span className="text-lg text-gray-500">{sensor.unit}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/sensor/${sensor.id}/edit`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSensor(sensor.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Updated: {new Date(sensor.updatedAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
