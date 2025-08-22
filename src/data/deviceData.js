// Mock IoT devices (e.g., M5Stack units)
export const mockDevices = [
  {
    id: 1,
    name: "M5Stack Core 1",
    type: "ESP32-based",
    macAddress: "AA:BB:CC:DD:EE:01",
    mqttClientId: "m5stack_core_1",
    status: "connected",
    lastSeen: "2025-08-22T10:30:00Z",
    wifiStrength: -45,
    batteryLevel: null, // Plugged in
    location: "Living Room"
  },
  {
    id: 2,
    name: "M5Stack Core 2", 
    type: "ESP32-based",
    macAddress: "AA:BB:CC:DD:EE:02",
    mqttClientId: "m5stack_core_2",
    status: "connected",
    lastSeen: "2025-08-22T10:29:00Z",
    wifiStrength: -52,
    batteryLevel: null,
    location: "Kitchen"
  },
  {
    id: 3,
    name: "M5Stack Core 3",
    type: "ESP32-based", 
    macAddress: "AA:BB:CC:DD:EE:03",
    mqttClientId: "m5stack_core_3",
    status: "offline",
    lastSeen: "2025-08-21T18:45:00Z",
    wifiStrength: null,
    batteryLevel: null,
    location: "Bedroom"
  }
];

// Sensor types and their capabilities
export const sensorTypes = {
  WATERING_UNIT: {
    name: "Watering Unit",
    dataFields: ["moisture", "pumpStatus", "soilTemperature"],
    capabilities: ["moisture_sensing", "pump_control"],
    shared: false // Typically dedicated to one plant
  },
  ENV_II: {
    name: "ENV II Sensor",
    dataFields: ["temperature", "humidity", "pressure"],
    capabilities: ["environmental_monitoring"],
    shared: true // Can serve multiple plants
  },
  LIGHT_SENSOR: {
    name: "Light Sensor",
    dataFields: ["lightLevel", "uvIndex"],
    capabilities: ["light_monitoring"],
    shared: true
  }
};

// Mock sensors attached to devices
export const mockSensors = [
  {
    id: 1,
    name: "Watering Unit 1",
    type: "WATERING_UNIT",
    deviceId: 1,
    mqttTopic: "ecogarden/watering1",
    shared: false,
    calibration: {
      moistureMin: 0,
      moistureMax: 1023,
      moistureOffset: 0
    },
    status: "active",
    lastReading: "2025-08-22T10:30:00Z",
    location: "Monstera Bucket"
  },
  {
    id: 2,
    name: "Watering Unit 2", 
    type: "WATERING_UNIT",
    deviceId: 2,
    mqttTopic: "ecogarden/watering2",
    shared: false,
    calibration: {
      moistureMin: 0,
      moistureMax: 1023,
      moistureOffset: -15
    },
    status: "active",
    lastReading: "2025-08-22T10:29:00Z",
    location: "Aloe Vera Bucket"
  },
  {
    id: 3,
    name: "Watering Unit 3",
    type: "WATERING_UNIT", 
    deviceId: 3,
    mqttTopic: "ecogarden/watering3",
    shared: false,
    calibration: {
      moistureMin: 0,
      moistureMax: 1023,
      moistureOffset: 10
    },
    status: "offline",
    lastReading: "2025-08-21T18:45:00Z",
    location: "Snake Plant Bucket"
  },
  {
    id: 4,
    name: "ENV II Living Room",
    type: "ENV_II",
    deviceId: 1,
    mqttTopic: "ecogarden/env_living_room",
    shared: true,
    calibration: {
      temperatureOffset: 0,
      humidityOffset: 2
    },
    status: "active",
    lastReading: "2025-08-22T10:30:00Z",
    location: "Living Room"
  }
];

// Plant-Sensor relationships (many-to-many)
export const plantSensorAssignments = [
  {
    plantId: 1, // Monstera
    sensorId: 1, // Watering Unit 1
    role: "primary_moisture"
  },
  {
    plantId: 1, // Monstera
    sensorId: 4, // ENV II Living Room
    role: "environmental"
  },
  {
    plantId: 2, // Aloe Vera
    sensorId: 2, // Watering Unit 2
    role: "primary_moisture"
  },
  {
    plantId: 2, // Aloe Vera
    sensorId: 4, // ENV II Living Room (shared)
    role: "environmental"
  },
  {
    plantId: 3, // Snake Plant
    sensorId: 3, // Watering Unit 3
    role: "primary_moisture"
  },
  {
    plantId: 3, // Snake Plant
    sensorId: 4, // ENV II Living Room (shared)
    role: "environmental"
  },
  {
    plantId: 4, // Fiddle Leaf Fig
    sensorId: 4, // ENV II Living Room (shared)
    role: "environmental"
  }
];

// Helper functions for data relationships
export const getSensorsForPlant = (plantId) => {
  const assignments = plantSensorAssignments.filter(a => a.plantId === plantId);
  return assignments.map(assignment => ({
    ...mockSensors.find(s => s.id === assignment.sensorId),
    role: assignment.role
  }));
};

export const getPlantsForSensor = (sensorId) => {
  const assignments = plantSensorAssignments.filter(a => a.sensorId === sensorId);
  return assignments.map(assignment => assignment.plantId);
};

export const getDeviceForSensor = (sensorId) => {
  const sensor = mockSensors.find(s => s.id === sensorId);
  return sensor ? mockDevices.find(d => d.id === sensor.deviceId) : null;
};

export const getSensorsByType = (type) => {
  return mockSensors.filter(s => s.type === type);
};

export const getAvailableSensors = () => {
  return mockSensors.filter(s => s.status === 'active');
};