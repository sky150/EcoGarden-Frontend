import React, { useState } from 'react';
import { Plus, X, Droplets, Thermometer, Sun, Activity, AlertCircle } from 'lucide-react';
import { sensorTypes } from '../data/deviceData';

const PlantSensorAssignment = ({ 
  plant, 
  sensors, 
  currentAssignments, 
  onAssignSensor, 
  onUnassignSensor, 
  isOpen,
  onClose 
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState('');
  const [selectedRole, setSelectedRole] = useState('primary_moisture');

  const getSensorIcon = (type) => {
    switch (type) {
      case 'WATERING_UNIT':
        return <Droplets className="text-blue-500" size={16} />;
      case 'ENV_II':
        return <Thermometer className="text-orange-500" size={16} />;
      case 'LIGHT_SENSOR':
        return <Sun className="text-yellow-500" size={16} />;
      default:
        return <Activity className="text-gray-500" size={16} />;
    }
  };

  const getAssignedSensors = () => {
    return currentAssignments
      .filter(a => a.plantId === plant.id)
      .map(assignment => ({
        ...sensors.find(s => s.id === assignment.sensorId),
        role: assignment.role
      }))
      .filter(Boolean);
  };

  const getAvailableSensors = () => {
    const assignedSensorIds = new Set(currentAssignments
      .filter(a => a.plantId === plant.id)
      .map(a => a.sensorId)
    );
    
    return sensors.filter(sensor => 
      sensor.status === 'active' && 
      (!assignedSensorIds.has(sensor.id) || sensor.shared)
    );
  };

  const handleAssignSensor = () => {
    if (selectedSensorId && selectedRole) {
      onAssignSensor(plant.id, parseInt(selectedSensorId), selectedRole);
      setSelectedSensorId('');
      setSelectedRole('primary_moisture');
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'primary_moisture': 'Primary Moisture',
      'environmental': 'Environmental',
      'backup_moisture': 'Backup Moisture',
      'light_monitoring': 'Light Monitoring'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'primary_moisture': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'environmental': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'backup_moisture': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'light_monitoring': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const assignedSensors = getAssignedSensors();
  const availableSensors = getAvailableSensors();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Manage Sensors for {plant.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Currently Assigned Sensors */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Assigned Sensors ({assignedSensors.length})
          </h3>
          
          {assignedSensors.length > 0 ? (
            <div className="space-y-3">
              {assignedSensors.map(sensor => (
                <div
                  key={`${sensor.id}-${sensor.role}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getSensorIcon(sensor.type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {sensor.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getRoleColor(sensor.role)}`}>
                          {getRoleDisplayName(sensor.role)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {sensorTypes[sensor.type]?.name} • {sensor.location || 'No location'}
                        {sensor.shared && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded">
                            Shared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onUnassignSensor(plant.id, sensor.id, sensor.role)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Remove sensor"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <AlertCircle size={24} className="mx-auto mb-2" />
              <p>No sensors assigned to this plant yet.</p>
            </div>
          )}
        </div>

        {/* Add New Sensor Assignment */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Assign New Sensor
          </h3>
          
          {availableSensors.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sensor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Sensor
                  </label>
                  <select
                    value={selectedSensorId}
                    onChange={(e) => setSelectedSensorId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Choose a sensor...</option>
                    {availableSensors.map(sensor => (
                      <option key={sensor.id} value={sensor.id}>
                        {sensor.name} ({sensorTypes[sensor.type]?.name})
                        {sensor.shared ? ' - Shared' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sensor Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="primary_moisture">Primary Moisture</option>
                    <option value="environmental">Environmental</option>
                    <option value="backup_moisture">Backup Moisture</option>
                    <option value="light_monitoring">Light Monitoring</option>
                  </select>
                </div>
              </div>

              {/* Selected Sensor Info */}
              {selectedSensorId && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  {(() => {
                    const sensor = sensors.find(s => s.id === parseInt(selectedSensorId));
                    const sensorType = sensorTypes[sensor?.type];
                    return (
                      <div className="flex items-center space-x-2">
                        {getSensorIcon(sensor?.type)}
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {sensor?.name}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Capabilities: {sensorType?.capabilities.join(', ')}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            MQTT Topic: {sensor?.mqttTopic}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <button
                onClick={handleAssignSensor}
                disabled={!selectedSensorId || !selectedRole}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                <span>Assign Sensor</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p>No available sensors to assign.</p>
              <p className="text-sm mt-1">
                All active sensors are already assigned (unless they're shared sensors).
              </p>
            </div>
          )}
        </div>

        {/* Role Descriptions */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Sensor Role Descriptions:
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div><strong>Primary Moisture:</strong> Main sensor for monitoring soil moisture and triggering watering.</div>
            <div><strong>Environmental:</strong> Monitors ambient conditions (temperature, humidity).</div>
            <div><strong>Backup Moisture:</strong> Secondary moisture sensor for redundancy.</div>
            <div><strong>Light Monitoring:</strong> Tracks light levels and UV exposure.</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantSensorAssignment;