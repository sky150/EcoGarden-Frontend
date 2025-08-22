import React, { useState } from 'react';
import { X, Wifi, AlertCircle } from 'lucide-react';
import { sensorTypes } from '../data/deviceData';

const AddSensorModal = ({ isOpen, onClose, onSave, devices, existingSensor = null }) => {
  const [formData, setFormData] = useState({
    name: existingSensor?.name || '',
    type: existingSensor?.type || 'WATERING_UNIT',
    deviceId: existingSensor?.deviceId || '',
    shared: existingSensor?.shared || false,
    location: existingSensor?.location || '',
    mqttTopic: existingSensor?.mqttTopic || '',
    calibration: existingSensor?.calibration || {}
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (existingSensor) {
      setFormData({
        name: existingSensor.name,
        type: existingSensor.type,
        deviceId: existingSensor.deviceId,
        shared: existingSensor.shared,
        location: existingSensor.location,
        mqttTopic: existingSensor.mqttTopic,
        calibration: existingSensor.calibration || {}
      });
    } else {
      setFormData({
        name: '',
        type: 'WATERING_UNIT',
        deviceId: '',
        shared: false,
        location: '',
        mqttTopic: '',
        calibration: {}
      });
    }
    setErrors({});
  }, [existingSensor, isOpen]);

  // Auto-generate MQTT topic when name or type changes
  React.useEffect(() => {
    if (formData.name && !existingSensor) {
      const topicName = formData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      setFormData(prev => ({
        ...prev,
        mqttTopic: `ecogarden/${topicName}`
      }));
    }
  }, [formData.name, formData.type, existingSensor]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Sensor name is required';
    }
    
    if (!formData.deviceId) {
      newErrors.deviceId = 'Please select a device';
    }
    
    if (!formData.mqttTopic.trim()) {
      newErrors.mqttTopic = 'MQTT topic is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const sensorData = {
        ...formData,
        id: existingSensor?.id || Date.now(),
        status: 'active',
        lastReading: new Date().toISOString()
      };
      onSave(sensorData);
      onClose();
    }
  };

  const selectedDevice = devices.find(d => d.id === parseInt(formData.deviceId));
  const selectedSensorType = sensorTypes[formData.type];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {existingSensor ? 'Edit Sensor' : 'Add New Sensor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sensor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sensor Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Watering Unit 1"
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Sensor Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sensor Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                type: e.target.value,
                shared: sensorTypes[e.target.value]?.shared || false
              }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(sensorTypes).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.name}
                </option>
              ))}
            </select>
            {selectedSensorType && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Capabilities: {selectedSensorType.capabilities.join(', ')}
              </p>
            )}
          </div>

          {/* Device Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IoT Device
            </label>
            <select
              value={formData.deviceId}
              onChange={(e) => setFormData(prev => ({ ...prev, deviceId: e.target.value }))}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                errors.deviceId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select a device...</option>
              {devices.filter(d => d.status === 'connected').map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.type})
                </option>
              ))}
            </select>
            {selectedDevice && (
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Wifi size={14} className="mr-1" />
                {selectedDevice.location} • Signal: {selectedDevice.wifiStrength}dBm
              </div>
            )}
            {errors.deviceId && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.deviceId}
              </p>
            )}
          </div>

          {/* Shared Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shared"
              checked={formData.shared}
              onChange={(e) => setFormData(prev => ({ ...prev, shared: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="shared" className="text-sm text-gray-700 dark:text-gray-300">
              Shared sensor (can serve multiple plants)
            </label>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location (Optional)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Living Room, Bucket 1"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* MQTT Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MQTT Topic
            </label>
            <input
              type="text"
              value={formData.mqttTopic}
              onChange={(e) => setFormData(prev => ({ ...prev, mqttTopic: e.target.value }))}
              placeholder="e.g., ecogarden/watering1"
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                errors.mqttTopic ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.mqttTopic && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.mqttTopic}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {existingSensor ? 'Update Sensor' : 'Add Sensor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSensorModal;