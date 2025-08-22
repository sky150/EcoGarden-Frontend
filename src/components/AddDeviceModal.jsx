import React, { useState } from 'react';
import { X, Wifi, AlertCircle } from 'lucide-react';

const AddDeviceModal = ({ isOpen, onClose, onSave, existingDevice = null }) => {
  const [formData, setFormData] = useState({
    name: existingDevice?.name || '',
    type: existingDevice?.type || 'ESP32-based',
    macAddress: existingDevice?.macAddress || '',
    mqttClientId: existingDevice?.mqttClientId || '',
    location: existingDevice?.location || '',
    wifiStrength: existingDevice?.wifiStrength || -50
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (existingDevice) {
      setFormData({
        name: existingDevice.name,
        type: existingDevice.type,
        macAddress: existingDevice.macAddress,
        mqttClientId: existingDevice.mqttClientId,
        location: existingDevice.location,
        wifiStrength: existingDevice.wifiStrength || -50
      });
    } else {
      setFormData({
        name: '',
        type: 'ESP32-based',
        macAddress: '',
        mqttClientId: '',
        location: '',
        wifiStrength: -50
      });
    }
    setErrors({});
  }, [existingDevice, isOpen]);

  // Auto-generate MQTT client ID when name changes
  React.useEffect(() => {
    if (formData.name && !existingDevice) {
      const clientId = formData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      setFormData(prev => ({
        ...prev,
        mqttClientId: clientId
      }));
    }
  }, [formData.name, existingDevice]);

  const validateMacAddress = (mac) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required';
    }
    
    if (!formData.macAddress.trim()) {
      newErrors.macAddress = 'MAC address is required';
    } else if (!validateMacAddress(formData.macAddress)) {
      newErrors.macAddress = 'Invalid MAC address format (use XX:XX:XX:XX:XX:XX)';
    }
    
    if (!formData.mqttClientId.trim()) {
      newErrors.mqttClientId = 'MQTT client ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const deviceData = {
        ...formData,
        id: existingDevice?.id || Date.now(),
        status: 'connected',
        lastSeen: new Date().toISOString(),
        batteryLevel: null // Assume powered devices
      };
      onSave(deviceData);
      onClose();
    }
  };

  const formatMacAddress = (value) => {
    // Remove all non-hex characters
    const hex = value.replace(/[^0-9A-Fa-f]/g, '');
    // Add colons every 2 characters
    const formatted = hex.match(/.{1,2}/g)?.join(':') || hex;
    // Limit to MAC address length
    return formatted.slice(0, 17).toUpperCase();
  };

  const handleMacAddressChange = (e) => {
    const formatted = formatMacAddress(e.target.value);
    setFormData(prev => ({ ...prev, macAddress: formatted }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {existingDevice ? 'Edit Device' : 'Add New Device'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Device Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., M5Stack Core 1"
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

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Device Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="ESP32-based">ESP32-based (M5Stack)</option>
              <option value="Arduino">Arduino</option>
              <option value="Raspberry Pi">Raspberry Pi</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* MAC Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MAC Address
            </label>
            <input
              type="text"
              value={formData.macAddress}
              onChange={handleMacAddressChange}
              placeholder="AA:BB:CC:DD:EE:FF"
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white font-mono ${
                errors.macAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              maxLength={17}
            />
            {errors.macAddress && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.macAddress}
              </p>
            )}
          </div>

          {/* MQTT Client ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MQTT Client ID
            </label>
            <input
              type="text"
              value={formData.mqttClientId}
              onChange={(e) => setFormData(prev => ({ ...prev, mqttClientId: e.target.value }))}
              placeholder="e.g., m5stack_core_1"
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white font-mono ${
                errors.mqttClientId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.mqttClientId && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.mqttClientId}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Used to identify this device in MQTT messages
            </p>
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
              placeholder="e.g., Living Room, Kitchen"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* WiFi Signal Strength */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              WiFi Signal Strength (dBm)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="-100"
                max="-30"
                value={formData.wifiStrength}
                onChange={(e) => setFormData(prev => ({ ...prev, wifiStrength: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <div className="flex items-center space-x-2">
                <Wifi size={16} className={
                  formData.wifiStrength >= -50 ? 'text-green-500' : 
                  formData.wifiStrength >= -70 ? 'text-yellow-500' : 'text-red-500'
                } />
                <span className="text-sm font-mono w-12">
                  {formData.wifiStrength}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Stronger signals are closer to 0 (e.g., -30 is excellent, -80 is poor)
            </p>
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
              {existingDevice ? 'Update Device' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;