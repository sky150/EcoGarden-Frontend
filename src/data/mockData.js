// Enhanced plant data with multi-sensor support
export const mockPlants = [
  {
    id: 1,
    name: "Monstera",
    species: "Monstera deliciosa",
    location: "Living Room",
    lastWatered: "2025-08-20T14:30:00Z",
    optimalMoisture: { min: 40, max: 70 },
    optimalTemperature: { min: 18, max: 27 },
    sensorData: {
      moisture: { value: 45, sensorId: 1, lastReading: "2025-08-22T10:30:00Z" },
      temperature: { value: 22.3, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      humidity: { value: 65, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      pumpStatus: { value: false, sensorId: 1, lastReading: "2025-08-22T10:30:00Z" }
    },
    plantedDate: "2024-03-15",
    notes: "Thriving in indirect light, watered weekly"
  },
  {
    id: 2, 
    name: "Aloe Vera",
    species: "Aloe barbadensis",
    location: "Kitchen",
    lastWatered: "2025-08-21T08:15:00Z",
    optimalMoisture: { min: 30, max: 50 },
    optimalTemperature: { min: 16, max: 24 },
    sensorData: {
      moisture: { value: 68, sensorId: 2, lastReading: "2025-08-22T10:29:00Z" },
      temperature: { value: 24.1, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      humidity: { value: 65, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      pumpStatus: { value: true, sensorId: 2, lastReading: "2025-08-22T10:29:00Z" }
    },
    plantedDate: "2024-01-10",
    notes: "Needs well-draining soil, minimal watering"
  },
  {
    id: 3,
    name: "Snake Plant",
    species: "Sansevieria trifasciata",
    location: "Bedroom", 
    lastWatered: "2025-08-19T16:45:00Z",
    optimalMoisture: { min: 25, max: 45 },
    optimalTemperature: { min: 15, max: 24 },
    sensorData: {
      moisture: { value: 32, sensorId: 3, lastReading: "2025-08-21T18:45:00Z" },
      temperature: { value: 21.8, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      humidity: { value: 65, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      pumpStatus: { value: false, sensorId: 3, lastReading: "2025-08-21T18:45:00Z" }
    },
    plantedDate: "2024-05-20",
    notes: "Very drought tolerant, prefers neglect"
  },
  {
    id: 4,
    name: "Fiddle Leaf Fig",
    species: "Ficus lyrata",
    location: "Office",
    lastWatered: "2025-08-20T11:20:00Z",
    optimalMoisture: { min: 50, max: 75 },
    optimalTemperature: { min: 18, max: 26 },
    sensorData: {
      temperature: { value: 23.5, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" },
      humidity: { value: 65, sensorId: 4, lastReading: "2025-08-22T10:30:00Z" }
    },
    plantedDate: "2024-02-28",
    notes: "No dedicated watering sensor yet - needs manual monitoring"
  }
];

// Helper functions for plant sensor data
export const getPlantSensorValue = (plant, dataType) => {
  return plant.sensorData?.[dataType]?.value || null;
};

export const getPlantSensorLastReading = (plant, dataType) => {
  return plant.sensorData?.[dataType]?.lastReading || null;
};

export const getPlantSensorId = (plant, dataType) => {
  return plant.sensorData?.[dataType]?.sensorId || null;
};

// Backwards compatibility getters
export const getPlantMoisture = (plant) => getPlantSensorValue(plant, 'moisture');
export const getPlantTemperature = (plant) => getPlantSensorValue(plant, 'temperature');
export const getPlantPumpStatus = (plant) => getPlantSensorValue(plant, 'pumpStatus');

// Generate realistic 24-hour chart data
export const generateChartData = (plantId) => {
  const baseData = {
    1: { baseMoisture: 45, baseTemp: 22 }, // Monstera
    2: { baseMoisture: 68, baseTemp: 24 }, // Aloe Vera  
    3: { baseMoisture: 32, baseTemp: 21 }, // Snake Plant
    4: { baseMoisture: 55, baseTemp: 23 }  // Fiddle Leaf Fig
  };

  const plant = baseData[plantId] || baseData[1];
  const data = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Simulate moisture decrease over time with some randomness
    const moistureVariation = Math.sin(hour * 0.3) * 8 + (Math.random() - 0.5) * 6;
    const moisture = Math.max(15, Math.min(85, plant.baseMoisture + moistureVariation - (hour * 0.8)));
    
    // Simulate temperature changes throughout the day
    const tempVariation = Math.sin((hour - 6) * 0.26) * 4 + (Math.random() - 0.5) * 2;
    const temperature = plant.baseTemp + tempVariation;
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      moisture: Math.round(moisture * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      hour
    });
  }
  
  return data;
};

// System overview stats
export const systemStats = {
  totalPlants: mockPlants.length,
  plantsNeedingWater: mockPlants.filter(p => {
    const moisture = getPlantMoisture(p);
    return moisture && moisture < p.optimalMoisture.min;
  }).length,
  activePumps: mockPlants.filter(p => getPlantPumpStatus(p)).length,
  avgTemperature: (() => {
    const plantsWithTemp = mockPlants.filter(p => getPlantTemperature(p) !== null);
    if (plantsWithTemp.length === 0) return null;
    const sum = plantsWithTemp.reduce((sum, p) => sum + getPlantTemperature(p), 0);
    return Math.round((sum / plantsWithTemp.length) * 10) / 10;
  })(),
  lastUpdated: new Date().toISOString()
};