import React from 'react';
import { Droplets, Thermometer, Power, AlertTriangle } from 'lucide-react';
import PlantCard from './PlantCard';
import { systemStats } from '../data/mockData';

const Overview = ({ plants, onTogglePump, onViewDetails }) => {
  const needsAttention = plants.filter(p => 
    p.moisture < p.optimalMoisture.min || p.moisture > p.optimalMoisture.max
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Garden Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(systemStats.lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.totalPlants}</p>
            </div>
            <Droplets className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Need Water</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{systemStats.plantsNeedingWater}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Pumps</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{systemStats.activePumps}</p>
            </div>
            <Power className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Temperature</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.avgTemperature}°C</p>
            </div>
            <Thermometer className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {needsAttention.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Plants Need Attention</h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            {needsAttention.map(p => p.name).join(', ')} {needsAttention.length === 1 ? 'has' : 'have'} moisture levels outside optimal range.
          </p>
        </div>
      )}

      {/* Plant Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Plants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onTogglePump={onTogglePump}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;