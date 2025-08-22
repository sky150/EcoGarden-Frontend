import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, Wifi } from 'lucide-react';

const MQTTSimulator = ({ sensors, onDataUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const generateSensorData = (sensor) => {
    const now = new Date().toISOString();
    const data = { timestamp: now };

    switch (sensor.type) {
      case 'WATERING_UNIT':
        // Simulate moisture slowly decreasing over time
        const currentMoisture = Math.max(10, Math.min(95, 
          45 + (Math.random() - 0.5) * 20 + Math.sin(Date.now() / 100000) * 15
        ));
        
        data.moisture = Math.round(currentMoisture * 10) / 10;
        data.pumpStatus = currentMoisture < 30 ? Math.random() > 0.7 : false;
        data.soilTemperature = Math.round((20 + Math.random() * 8) * 10) / 10;
        break;

      case 'ENV_II':
        // Simulate environmental conditions with daily cycles
        const hourOfDay = new Date().getHours();
        const tempBase = 18 + Math.sin((hourOfDay - 6) * Math.PI / 12) * 6;
        
        data.temperature = Math.round((tempBase + (Math.random() - 0.5) * 4) * 10) / 10;
        data.humidity = Math.round((55 + Math.sin(hourOfDay * Math.PI / 12) * 15 + (Math.random() - 0.5) * 10) * 10) / 10;
        data.pressure = Math.round((1013 + (Math.random() - 0.5) * 20) * 10) / 10;
        break;

      case 'LIGHT_SENSOR':
        // Simulate light levels based on time of day
        const hour = new Date().getHours();
        let lightLevel = 0;
        if (hour >= 6 && hour <= 18) {
          lightLevel = Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 100);
        }
        
        data.lightLevel = Math.round((lightLevel + (Math.random() - 0.5) * 20) * 10) / 10;
        data.uvIndex = Math.round((lightLevel / 100 * 8 + (Math.random() - 0.5) * 2) * 10) / 10;
        break;

      default:
        data.value = Math.round(Math.random() * 100 * 10) / 10;
    }

    return data;
  };

  const simulateDataUpdate = () => {
    const activeSensors = sensors.filter(s => s.status === 'active');
    const updates = {};

    activeSensors.forEach(sensor => {
      const mqttData = generateSensorData(sensor);
      updates[sensor.id] = {
        sensorId: sensor.id,
        topic: sensor.mqttTopic,
        data: mqttData,
        timestamp: new Date().toISOString()
      };
    });

    if (Object.keys(updates).length > 0) {
      onDataUpdate(updates);
      setLastUpdate(new Date().toISOString());
    }
  };

  const startSimulation = () => {
    if (!isRunning) {
      const id = setInterval(simulateDataUpdate, 5000); // Update every 5 seconds
      setIntervalId(id);
      setIsRunning(true);
      simulateDataUpdate(); // Send initial data
    }
  };

  const stopSimulation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };

  const resetSimulation = () => {
    stopSimulation();
    setLastUpdate(null);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  const activeSensorCount = sensors.filter(s => s.status === 'active').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            MQTT Data Simulator
          </h3>
          {isRunning && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Live</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={isRunning ? stopSimulation : startSimulation}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isRunning
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
            }`}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span>{isRunning ? 'Stop' : 'Start'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Active Sensors:</span>
          <span className="font-medium text-gray-900 dark:text-white">{activeSensorCount}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span className={`font-medium ${
            isRunning 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-500'
          }`}>
            {isRunning ? 'Publishing Data' : 'Stopped'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatTime(lastUpdate)}
          </span>
        </div>
      </div>

      {activeSensorCount === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            No active sensors available for simulation. Add some sensors first.
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          This simulator generates realistic sensor data every 5 seconds for all active sensors.
          Data includes moisture levels, temperature, humidity, and pump status based on sensor type.
        </p>
      </div>
    </div>
  );
};

export default MQTTSimulator;