import React from 'react';
import { Edit2, Trash2, Wifi, WifiOff, Droplets, Thermometer, Sun, Activity } from 'lucide-react';
import { sensorTypes } from '../data/deviceData';

const SensorList = ({ sensors, devices, onEdit, onDelete, plantSensorAssignments }) => {
  const getSensorIcon = (type) => {
    switch (type) {
      case 'WATERING_UNIT':
        return <Droplets className="text-blue-500" size={20} />;
      case 'ENV_II':
        return <Thermometer className="text-orange-500" size={20} />;
      case 'LIGHT_SENSOR':
        return <Sun className="text-yellow-500" size={20} />;
      default:
        return <Activity className="text-gray-500" size={20} />;
    }
  };

  const getDeviceForSensor = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? devices.find(d => d.id === sensor.deviceId) : null;
  };

  const getAssignedPlantsCount = (sensorId) => {
    return plantSensorAssignments.filter(a => a.sensorId === sensorId).length;
  };

  const formatLastReading = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (sensors.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No sensors configured
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add your first sensor to start monitoring your plants.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sensors.map(sensor => {
        const device = getDeviceForSensor(sensor.id);
        const sensorType = sensorTypes[sensor.type];
        const assignedPlantsCount = getAssignedPlantsCount(sensor.id);
        const isOnline = sensor.status === 'active' && device?.status === 'connected';

        return (
          <div
            key={sensor.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getSensorIcon(sensor.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {sensor.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {isOnline ? (
                        <Wifi size={16} className="text-green-500" />
                      ) : (
                        <WifiOff size={16} className="text-red-500" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isOnline 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {sensorType?.name} • {sensor.location || 'No location set'}
                  </p>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span>Device: {device?.name || 'Unknown device'}</span>
                      <span>Topic: {sensor.mqttTopic}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>
                        Assigned to: {assignedPlantsCount} plant{assignedPlantsCount !== 1 ? 's' : ''}
                      </span>
                      {sensor.shared && (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs">
                          Shared
                        </span>
                      )}
                    </div>
                    <div>
                      Last reading: {formatLastReading(sensor.lastReading)}
                    </div>
                  </div>

                  {/* Sensor capabilities */}
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {sensorType?.capabilities.map(capability => (
                        <span
                          key={capability}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          {capability.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(sensor)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Edit sensor"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(sensor.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete sensor"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SensorList;