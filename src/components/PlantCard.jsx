import React from 'react';
import { Leaf, Droplets, Thermometer, Power, Clock } from 'lucide-react';

const PlantCard = ({ plant, onTogglePump, onViewDetails }) => {
  const getMoistureColor = (moisture, optimal) => {
    if (moisture < optimal.min) return 'text-red-600 dark:text-red-400';
    if (moisture > optimal.max) return 'text-blue-600 dark:text-blue-400';
    return 'text-primary-600 dark:text-primary-400';
  };

  const getMoistureStatus = (moisture, optimal) => {
    if (moisture < optimal.min) return 'Low';
    if (moisture > optimal.max) return 'High';
    return 'Optimal';
  };

  const formatLastWatered = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plant.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{plant.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary-500" />
          {plant.pumpStatus && (
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moisture</span>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${getMoistureColor(plant.moisture, plant.optimalMoisture)}`}>
              {plant.moisture}%
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getMoistureStatus(plant.moisture, plant.optimalMoisture)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {plant.temperature}°C
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Power className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pump</span>
          </div>
          <button
            onClick={() => onTogglePump(plant.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              plant.pumpStatus
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={`Pump is ${plant.pumpStatus ? 'ON' : 'OFF'}, click to toggle`}
          >
            {plant.pumpStatus ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Watered</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatLastWatered(plant.lastWatered)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(plant)}
        className="w-full mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        aria-label={`View detailed charts for ${plant.name}`}
      >
        View 24h Trends
      </button>
    </div>
  );
};

export default PlantCard;