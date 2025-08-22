import React from 'react';
import { Leaf, Droplets, Thermometer, Power, Clock, Activity, AlertCircle } from 'lucide-react';
import { getPlantMoisture, getPlantTemperature, getPlantPumpStatus, getPlantSensorLastReading } from '../data/mockData';

const PlantCard = ({ plant, onTogglePump, onViewDetails }) => {
  const moisture = getPlantMoisture(plant);
  const temperature = getPlantTemperature(plant);
  const pumpStatus = getPlantPumpStatus(plant);

  const getMoistureColor = (moisture, optimal) => {
    if (!moisture) return 'text-gray-400 dark:text-gray-500';
    if (moisture < optimal.min) return 'text-red-600 dark:text-red-400';
    if (moisture > optimal.max) return 'text-blue-600 dark:text-blue-400';
    return 'text-primary-600 dark:text-primary-400';
  };

  const getMoistureStatus = (moisture, optimal) => {
    if (!moisture) return 'No Data';
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

  const formatLastReading = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plant.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{plant.species || plant.location}</p>
          {plant.species && <p className="text-xs text-gray-500 dark:text-gray-500">{plant.location}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary-500" />
          {pumpStatus && (
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Moisture Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moisture</span>
            {!moisture && <AlertCircle className="h-3 w-3 text-amber-500" />}
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${getMoistureColor(moisture, plant.optimalMoisture)}`}>
              {moisture ? `${moisture}%` : 'No Data'}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getMoistureStatus(moisture, plant.optimalMoisture)}
            </p>
            {moisture && (
              <p className="text-xs text-gray-400">
                {formatLastReading(getPlantSensorLastReading(plant, 'moisture'))}
              </p>
            )}
          </div>
        </div>

        {/* Temperature Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
            {!temperature && <AlertCircle className="h-3 w-3 text-amber-500" />}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {temperature ? `${temperature}°C` : 'No Data'}
            </span>
            {temperature && (
              <p className="text-xs text-gray-400">
                {formatLastReading(getPlantSensorLastReading(plant, 'temperature'))}
              </p>
            )}
          </div>
        </div>

        {/* Pump Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Power className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pump</span>
            {pumpStatus === null && <AlertCircle className="h-3 w-3 text-amber-500" />}
          </div>
          <div className="text-right">
            <button
              onClick={() => onTogglePump(plant.id)}
              disabled={pumpStatus === null}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                pumpStatus === null
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : pumpStatus
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label={`Pump is ${pumpStatus ? 'ON' : 'OFF'}, click to toggle`}
            >
              {pumpStatus === null ? 'No Sensor' : pumpStatus ? 'ON' : 'OFF'}
            </button>
            {pumpStatus !== null && (
              <p className="text-xs text-gray-400 mt-1">
                {formatLastReading(getPlantSensorLastReading(plant, 'pumpStatus'))}
              </p>
            )}
          </div>
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