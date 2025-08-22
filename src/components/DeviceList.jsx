import React from 'react';
import { Edit2, Trash2, Wifi, WifiOff, Battery, Zap, MapPin, Clock } from 'lucide-react';

const DeviceList = ({ devices, sensors, onEdit, onDelete }) => {
  const getSensorsForDevice = (deviceId) => {
    return sensors.filter(s => s.deviceId === deviceId);
  };

  const formatLastSeen = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const getSignalStrengthColor = (strength) => {
    if (strength >= -50) return 'text-green-500';
    if (strength >= -70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalStrengthBars = (strength) => {
    if (strength >= -50) return 4;
    if (strength >= -60) return 3;
    if (strength >= -70) return 2;
    return 1;
  };

  if (devices.length === 0) {
    return (
      <div className="text-center py-8">
        <Wifi size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No devices registered
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add your first IoT device to start managing sensors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {devices.map(device => {
        const deviceSensors = getSensorsForDevice(device.id);
        const isOnline = device.status === 'connected';

        return (
          <div
            key={device.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {isOnline ? (
                    <Wifi className="text-green-500" size={24} />
                  ) : (
                    <WifiOff className="text-red-500" size={24} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {device.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isOnline 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {device.type} • MAC: {device.macAddress}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {/* Location and MQTT */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} />
                        <span>{device.location || 'No location set'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">MQTT:</span>
                        <span className="font-mono text-xs">{device.mqttClientId}</span>
                      </div>
                    </div>

                    {/* Status and Signal */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>Last seen: {formatLastSeen(device.lastSeen)}</span>
                      </div>
                      
                      {isOnline && device.wifiStrength && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4].map(bar => (
                              <div
                                key={bar}
                                className={`w-1 h-3 rounded-sm ${
                                  bar <= getSignalStrengthBars(device.wifiStrength)
                                    ? getSignalStrengthColor(device.wifiStrength)
                                    : 'bg-gray-300 dark:bg-gray-600'
                                } ${bar === 1 ? 'h-1' : bar === 2 ? 'h-2' : bar === 3 ? 'h-3' : 'h-4'}`}
                                style={{ backgroundColor: bar <= getSignalStrengthBars(device.wifiStrength) ? 'currentColor' : undefined }}
                              />
                            ))}
                          </div>
                          <span className={getSignalStrengthColor(device.wifiStrength)}>
                            {device.wifiStrength}dBm
                          </span>
                        </div>
                      )}

                      {device.batteryLevel !== null && (
                        <div className="flex items-center space-x-2">
                          <Battery size={14} />
                          <span>{device.batteryLevel}%</span>
                        </div>
                      )}

                      {device.batteryLevel === null && (
                        <div className="flex items-center space-x-2">
                          <Zap size={14} />
                          <span>Powered</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attached Sensors */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Attached Sensors ({deviceSensors.length})
                      </h4>
                    </div>
                    
                    {deviceSensors.length > 0 ? (
                      <div className="space-y-1">
                        {deviceSensors.map(sensor => (
                          <div key={sensor.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {sensor.name}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                sensor.status === 'active' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {sensor.status}
                              </span>
                              {sensor.shared && (
                                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                                  Shared
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No sensors attached to this device
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(device)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Edit device"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(device.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete device"
                  disabled={deviceSensors.length > 0}
                >
                  <Trash2 size={16} className={deviceSensors.length > 0 ? 'opacity-50' : ''} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceList;