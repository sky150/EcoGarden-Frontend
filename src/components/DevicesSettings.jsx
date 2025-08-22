import React, { useState } from 'react';
import { Plus, Settings, Wifi, Activity, Search } from 'lucide-react';
import DeviceList from './DeviceList';
import SensorList from './SensorList';
import AddDeviceModal from './AddDeviceModal';
import AddSensorModal from './AddSensorModal';
import MQTTSimulator from './MQTTSimulator';

const DevicesSettings = ({ 
  devices, 
  sensors, 
  onDeviceUpdate,
  onSensorUpdate,
  onMQTTDataUpdate
}) => {
  const [activeTab, setActiveTab] = useState('devices');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddSensor, setShowAddSensor] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [editingSensor, setEditingSensor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSensors = sensors.filter(sensor =>
    sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sensor.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeviceSave = (deviceData) => {
    onDeviceUpdate(deviceData);
    setEditingDevice(null);
  };

  const handleDeviceEdit = (device) => {
    setEditingDevice(device);
    setShowAddDevice(true);
  };

  const handleDeviceDelete = (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      onDeviceUpdate({ id: deviceId, _delete: true });
    }
  };

  const handleSensorSave = (sensorData) => {
    onSensorUpdate(sensorData);
    setEditingSensor(null);
  };

  const handleSensorEdit = (sensor) => {
    setEditingSensor(sensor);
    setShowAddSensor(true);
  };

  const handleSensorDelete = (sensorId) => {
    if (window.confirm('Are you sure you want to delete this sensor? This will remove all plant assignments.')) {
      onSensorUpdate({ id: sensorId, _delete: true });
    }
  };


  const getDeviceStats = () => {
    const online = devices.filter(d => d.status === 'connected').length;
    const offline = devices.length - online;
    return { total: devices.length, online, offline };
  };

  const getSensorStats = () => {
    const active = sensors.filter(s => s.status === 'active').length;
    const inactive = sensors.length - active;
    const shared = sensors.filter(s => s.shared).length;
    return { total: sensors.length, active, inactive, shared };
  };

  const deviceStats = getDeviceStats();
  const sensorStats = getSensorStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Devices & Sensors</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your IoT devices, sensors, and plant assignments
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddDevice(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Add Device</span>
          </button>
          <button
            onClick={() => setShowAddSensor(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={16} />
            <span>Add Sensor</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Devices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{deviceStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Online Devices</p>
              <p className="text-2xl font-bold text-green-600">{deviceStats.online}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sensors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sensorStats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shared Sensors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sensorStats.shared}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'devices'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Devices ({deviceStats.total})
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sensors'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sensors ({sensorStats.total})
          </button>
          <button
            onClick={() => setActiveTab('mqtt')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mqtt'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            MQTT Simulator
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {activeTab === 'devices' && (
          <DeviceList
            devices={filteredDevices}
            sensors={sensors}
            onEdit={handleDeviceEdit}
            onDelete={handleDeviceDelete}
          />
        )}

        {activeTab === 'sensors' && (
          <SensorList
            sensors={filteredSensors}
            devices={devices}
            plantSensorAssignments={[]} // Empty for now, assignments handled in Plants page
            onEdit={handleSensorEdit}
            onDelete={handleSensorDelete}
          />
        )}


        {activeTab === 'mqtt' && (
          <MQTTSimulator
            sensors={sensors}
            onDataUpdate={onMQTTDataUpdate}
          />
        )}
      </div>

      {/* Modals */}
      <AddDeviceModal
        isOpen={showAddDevice}
        onClose={() => {
          setShowAddDevice(false);
          setEditingDevice(null);
        }}
        onSave={handleDeviceSave}
        existingDevice={editingDevice}
      />

      <AddSensorModal
        isOpen={showAddSensor}
        onClose={() => {
          setShowAddSensor(false);
          setEditingSensor(null);
        }}
        onSave={handleSensorSave}
        devices={devices}
        existingSensor={editingSensor}
      />

    </div>
  );
};

export default DevicesSettings;