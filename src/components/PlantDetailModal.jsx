import React from 'react';
import { X, Droplets, Thermometer, Power, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateChartData } from '../data/mockData';

const PlantDetailModal = ({ plant, isOpen, onClose }) => {
  if (!isOpen || !plant) return null;

  const chartData = generateChartData(plant.id);
  
  // Calculate trends
  const moistureTrend = chartData[chartData.length - 1].moisture - chartData[0].moisture;
  const tempTrend = chartData[chartData.length - 1].temperature - chartData[0].temperature;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`text-sm`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.dataKey === 'moisture' ? '%' : '°C'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plant.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{plant.location} • 24-Hour Monitoring</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Moisture</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plant.moisture}%</p>
              <div className="flex items-center mt-1">
                {moistureTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${moistureTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {moistureTrend > 0 ? '+' : ''}{moistureTrend.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-300">Temperature</span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{plant.temperature}°C</p>
              <div className="flex items-center mt-1">
                {tempTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-blue-500 mr-1" />
                )}
                <span className={`text-xs ${tempTrend > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {tempTrend > 0 ? '+' : ''}{tempTrend.toFixed(1)}°C
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              plant.pumpStatus 
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' 
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Power className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-purple-700 dark:text-purple-300">Pump Status</span>
              </div>
              <p className={`text-2xl font-bold ${
                plant.pumpStatus 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {plant.pumpStatus ? 'ON' : 'OFF'}
              </p>
              {plant.pumpStatus && (
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-primary-600 dark:text-primary-400">Active</span>
                </div>
              )}
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-green-700 dark:text-green-300">Optimal Range</span>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {plant.optimalMoisture.min}-{plant.optimalMoisture.max}%
              </p>
              <span className={`text-xs ${
                plant.moisture >= plant.optimalMoisture.min && plant.moisture <= plant.optimalMoisture.max
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {plant.moisture >= plant.optimalMoisture.min && plant.moisture <= plant.optimalMoisture.max
                  ? 'In range'
                  : 'Out of range'
                }
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">24-Hour Sensor Trends</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#6b7280' }}
                    axisLine={{ stroke: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#6b7280' }}
                    axisLine={{ stroke: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Reference lines for optimal moisture range */}
                  <ReferenceLine 
                    y={plant.optimalMoisture.min} 
                    stroke="#22c55e" 
                    strokeDasharray="5 5" 
                    label={{ value: "Min", position: "insideTopRight" }}
                  />
                  <ReferenceLine 
                    y={plant.optimalMoisture.max} 
                    stroke="#22c55e" 
                    strokeDasharray="5 5" 
                    label={{ value: "Max", position: "insideTopRight" }}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="moisture" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Moisture (%)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Temperature (°C)"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Moisture (%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Temperature (°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Optimal Range</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailModal;