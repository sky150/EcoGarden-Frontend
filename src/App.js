import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import PlantDetailModal from './components/PlantDetailModal';
import { mockPlants } from './data/mockData';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [plants, setPlants] = useState(mockPlants);
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
    setPlants(plants.map(plant => 
      plant.id === plantId 
        ? { ...plant, pumpStatus: !plant.pumpStatus }
        : plant
    ));
  };

  const handleViewDetails = (plant) => {
    setSelectedPlant(plant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlant(null);
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
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plants Management</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Plant management features coming soon...
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>• Add new plants to your garden</li>
                <li>• Configure optimal moisture ranges</li>
                <li>• Set up automated watering schedules</li>
                <li>• Plant care reminders and tips</li>
              </ul>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Settings panel coming soon...
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>• MQTT broker configuration</li>
                <li>• Sensor calibration settings</li>
                <li>• Notification preferences</li>
                <li>• Data export options</li>
                <li>• Device management</li>
              </ul>
            </div>
          </div>
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