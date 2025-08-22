import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import PlantDetailModal from './components/PlantDetailModal';
import PlantsPage from './components/PlantsPage';
import DevicesSettings from './components/DevicesSettings';
import SettingsPage from './components/SettingsPage';
import { mockPlants, getPlantPumpStatus } from './data/mockData';
import { mockDevices, mockSensors, plantSensorAssignments } from './data/deviceData';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [plants, setPlants] = useState(mockPlants);
  const [devices, setDevices] = useState(mockDevices);
  const [sensors, setSensors] = useState(mockSensors);
  const [assignments, setAssignments] = useState(plantSensorAssignments);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleTogglePump = (plantId) => {
    setPlants(plants.map(plant => {
      if (plant.id === plantId) {
        const currentPumpStatus = getPlantPumpStatus(plant);
        if (currentPumpStatus !== null) {
          return {
            ...plant,
            sensorData: {
              ...plant.sensorData,
              pumpStatus: {
                ...plant.sensorData.pumpStatus,
                value: !currentPumpStatus,
                lastReading: new Date().toISOString()
              }
            }
          };
        }
      }
      return plant;
    }));
  };

  const handleViewDetails = (plant) => {
    setSelectedPlant(plant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlant(null);
  };

  const handleDeviceUpdate = (deviceData) => {
    if (deviceData._delete) {
      setDevices(devices.filter(d => d.id !== deviceData.id));
    } else if (devices.find(d => d.id === deviceData.id)) {
      setDevices(devices.map(d => d.id === deviceData.id ? deviceData : d));
    } else {
      setDevices([...devices, deviceData]);
    }
  };

  const handleSensorUpdate = (sensorData) => {
    if (sensorData._delete) {
      setSensors(sensors.filter(s => s.id !== sensorData.id));
      setAssignments(assignments.filter(a => a.sensorId !== sensorData.id));
    } else if (sensors.find(s => s.id === sensorData.id)) {
      setSensors(sensors.map(s => s.id === sensorData.id ? sensorData : s));
    } else {
      setSensors([...sensors, sensorData]);
    }
  };

  const handlePlantUpdate = (plantData) => {
    if (plantData._delete) {
      setPlants(plants.filter(p => p.id !== plantData.id));
      setAssignments(assignments.filter(a => a.plantId !== plantData.id));
    } else if (plants.find(p => p.id === plantData.id)) {
      setPlants(plants.map(p => p.id === plantData.id ? plantData : p));
    } else {
      setPlants([...plants, plantData]);
    }
  };

  const handlePlantSensorAssignment = ({ plantId, sensorId, role, action }) => {
    if (action === 'assign') {
      const newAssignment = { plantId, sensorId, role };
      if (!assignments.find(a => a.plantId === plantId && a.sensorId === sensorId && a.role === role)) {
        setAssignments([...assignments, newAssignment]);
      }
    } else if (action === 'unassign') {
      setAssignments(assignments.filter(a => 
        !(a.plantId === plantId && a.sensorId === sensorId && a.role === role)
      ));
    }
  };

  const handleMQTTDataUpdate = (updates) => {
    // Update plants with new sensor data
    setPlants(currentPlants => {
      return currentPlants.map(plant => {
        let updatedPlant = { ...plant };
        let hasUpdates = false;

        // Find sensors assigned to this plant
        const plantAssignments = assignments.filter(a => a.plantId === plant.id);
        
        plantAssignments.forEach(assignment => {
          const sensorUpdate = updates[assignment.sensorId];
          if (sensorUpdate) {
            const { data, timestamp } = sensorUpdate;
            
            // Map sensor data to plant sensor data based on sensor type and role
            if (assignment.role === 'primary_moisture' && data.moisture !== undefined) {
              updatedPlant.sensorData = {
                ...updatedPlant.sensorData,
                moisture: { value: data.moisture, sensorId: assignment.sensorId, lastReading: timestamp }
              };
              hasUpdates = true;
            }
            
            if (assignment.role === 'primary_moisture' && data.pumpStatus !== undefined) {
              updatedPlant.sensorData = {
                ...updatedPlant.sensorData,
                pumpStatus: { value: data.pumpStatus, sensorId: assignment.sensorId, lastReading: timestamp }
              };
              hasUpdates = true;
            }
            
            if (assignment.role === 'environmental' && data.temperature !== undefined) {
              updatedPlant.sensorData = {
                ...updatedPlant.sensorData,
                temperature: { value: data.temperature, sensorId: assignment.sensorId, lastReading: timestamp }
              };
              hasUpdates = true;
            }
            
            if (assignment.role === 'environmental' && data.humidity !== undefined) {
              updatedPlant.sensorData = {
                ...updatedPlant.sensorData,
                humidity: { value: data.humidity, sensorId: assignment.sensorId, lastReading: timestamp }
              };
              hasUpdates = true;
            }
          }
        });

        return hasUpdates ? updatedPlant : plant;
      });
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <Overview 
            plants={plants}
            onTogglePump={handleTogglePump}
            onViewDetails={handleViewDetails}
          />
        );
      case 'plants':
        return (
          <PlantsPage
            plants={plants}
            sensors={sensors}
            plantSensorAssignments={assignments}
            onPlantUpdate={handlePlantUpdate}
            onTogglePump={handleTogglePump}
            onViewDetails={handleViewDetails}
            onPlantSensorAssignment={handlePlantSensorAssignment}
          />
        );
      case 'devices':
        return (
          <DevicesSettings
            devices={devices}
            sensors={sensors}
            onDeviceUpdate={handleDeviceUpdate}
            onSensorUpdate={handleSensorUpdate}
            onMQTTDataUpdate={handleMQTTDataUpdate}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
      <PlantDetailModal
        plant={selectedPlant}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;