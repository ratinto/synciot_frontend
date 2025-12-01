import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sensorService } from '../services/api';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const sensorTypes = [
  { value: 'temperature', label: 'Temperature', defaultUnit: '°C' },
  { value: 'humidity', label: 'Humidity', defaultUnit: '%' },
  { value: 'distance', label: 'Distance', defaultUnit: 'cm' },
  { value: 'battery', label: 'Battery', defaultUnit: '%' },
  { value: 'signal', label: 'Signal Strength', defaultUnit: 'dBm' },
  { value: 'pressure', label: 'Pressure', defaultUnit: 'hPa' },
  { value: 'light', label: 'Light', defaultUnit: 'lux' },
];

export const EditSensor = () => {
  const { id: sensorId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'temperature',
    value: 0,
    unit: '°C',
  });
  const [robotId, setRobotId] = useState(null);

  useEffect(() => {
    fetchSensor();
  }, [sensorId]);

  const fetchSensor = async () => {
    try {
      setIsLoading(true);
      const response = await sensorService.getSensorById(sensorId);
      if (response?.success && response?.data) {
        const sensor = response.data;
        setFormData({
          name: sensor.name,
          type: sensor.type,
          value: sensor.value,
          unit: sensor.unit,
        });
        setRobotId(sensor.robotId);
      }
    } catch (err) {
      console.error('Error fetching sensor:', err);
      setError('Failed to load sensor details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      const selectedType = sensorTypes.find(t => t.value === value);
      setFormData(prev => ({
        ...prev,
        type: value,
        unit: selectedType?.defaultUnit || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'value' ? parseFloat(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Sensor name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Updating sensor:', sensorId, formData);
      const response = await sensorService.updateSensor(sensorId, formData);
      console.log('Update response:', response);
      if (response?.success) {
        navigate(`/robot/${robotId}`);
      } else {
        setError(response?.message || 'Failed to update sensor');
      }
    } catch (err) {
      console.error('Error updating sensor:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update sensor';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading sensor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/robot/${robotId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Sensor</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Update sensor details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sensor Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Sensor Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Temperature Sensor"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Sensor Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Sensor Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sensorTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.defaultUnit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Value */}
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value *
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g., °C, %, cm"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/robot/${robotId}`)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Sensor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
