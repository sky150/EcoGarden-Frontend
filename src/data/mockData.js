// Mock sensor data for plants
export const mockPlants = [
  {
    id: 1,
    name: "Monstera",
    moisture: 45,
    temperature: 22.3,
    pumpStatus: false,
    location: "Living Room",
    lastWatered: "2025-08-20T14:30:00Z",
    optimalMoisture: { min: 40, max: 70 }
  },
  {
    id: 2, 
    name: "Aloe Vera",
    moisture: 68,
    temperature: 24.1,
    pumpStatus: true,
    location: "Kitchen",
    lastWatered: "2025-08-21T08:15:00Z",
    optimalMoisture: { min: 30, max: 50 }
  },
  {
    id: 3,
    name: "Snake Plant",
    moisture: 32,
    temperature: 21.8,
    pumpStatus: false,
    location: "Bedroom", 
    lastWatered: "2025-08-19T16:45:00Z",
    optimalMoisture: { min: 25, max: 45 }
  },
  {
    id: 4,
    name: "Fiddle Leaf Fig",
    moisture: 55,
    temperature: 23.5,
    pumpStatus: false,
    location: "Office",
    lastWatered: "2025-08-20T11:20:00Z",
    optimalMoisture: { min: 50, max: 75 }
  }
];

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
  plantsNeedingWater: mockPlants.filter(p => p.moisture < p.optimalMoisture.min).length,
  activePumps: mockPlants.filter(p => p.pumpStatus).length,
  avgTemperature: Math.round((mockPlants.reduce((sum, p) => sum + p.temperature, 0) / mockPlants.length) * 10) / 10,
  lastUpdated: new Date().toISOString()
};