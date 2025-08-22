import React, { useState } from 'react';
import { 
  Save, 
  Wifi, 
  Bell, 
  Download, 
  Upload, 
  User, 
  Database,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const SettingsPage = ({ darkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('mqtt');
  const [mqttSettings, setMqttSettings] = useState({
    brokerUrl: 'localhost',
    port: 1883,
    username: '',
    password: '',
    clientId: 'ecogarden_app',
    keepAlive: 60,
    cleanSession: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowMoisture: true,
    highTemperature: true,
    pumpFailure: true,
    deviceOffline: true,
    dailySummary: false,
    emailNotifications: false,
    pushNotifications: true,
    email: ''
  });

  const [dataSettings, setDataSettings] = useState({
    retentionDays: 30,
    exportFormat: 'json',
    autoBackup: false,
    backupFrequency: 'weekly'
  });

  const handleSaveSettings = (section) => {
    // In a real app, this would save to backend/localStorage
    console.log(`Saving ${section} settings`);
    // Show success message
  };

  const handleExportData = () => {
    console.log('Exporting data...');
    // Implement data export
  };

  const handleImportData = () => {
    console.log('Importing data...');
    // Implement data import
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      console.log('Clearing all data...');
      // Implement data clearing
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your EcoGarden application preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('mqtt')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'mqtt'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          MQTT Broker
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'data'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Data & Backup
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'appearance'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Appearance
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* MQTT Settings */}
        {activeTab === 'mqtt' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Wifi className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">MQTT Broker Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Broker URL
                </label>
                <input
                  type="text"
                  value={mqttSettings.brokerUrl}
                  onChange={(e) => setMqttSettings(prev => ({ ...prev, brokerUrl: e.target.value }))}
                  placeholder="localhost or IP address"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={mqttSettings.port}
                  onChange={(e) => setMqttSettings(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                  placeholder="1883"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  value={mqttSettings.username}
                  onChange={(e) => setMqttSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  value={mqttSettings.password}
                  onChange={(e) => setMqttSettings(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={mqttSettings.clientId}
                  onChange={(e) => setMqttSettings(prev => ({ ...prev, clientId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Keep Alive (seconds)
                </label>
                <input
                  type="number"
                  value={mqttSettings.keepAlive}
                  onChange={(e) => setMqttSettings(prev => ({ ...prev, keepAlive: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="cleanSession"
                checked={mqttSettings.cleanSession}
                onChange={(e) => setMqttSettings(prev => ({ ...prev, cleanSession: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="cleanSession" className="text-sm text-gray-700 dark:text-gray-300">
                Clean Session (recommended for new connections)
              </label>
            </div>

            <button
              onClick={() => handleSaveSettings('mqtt')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save size={16} />
              <span>Save MQTT Settings</span>
            </button>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Alert Types</h3>
                <div className="space-y-3">
                  {[
                    { key: 'lowMoisture', label: 'Low Moisture Alerts', description: 'Get notified when plants need watering' },
                    { key: 'highTemperature', label: 'High Temperature Alerts', description: 'Get notified when temperature exceeds plant limits' },
                    { key: 'pumpFailure', label: 'Pump Failure Alerts', description: 'Get notified when pump operations fail' },
                    { key: 'deviceOffline', label: 'Device Offline Alerts', description: 'Get notified when sensors go offline' },
                    { key: 'dailySummary', label: 'Daily Summary', description: 'Receive daily garden status reports' }
                  ].map(alert => (
                    <div key={alert.key} className="flex items-start">
                      <input
                        type="checkbox"
                        id={alert.key}
                        checked={notificationSettings[alert.key]}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          [alert.key]: e.target.checked 
                        }))}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <label htmlFor={alert.key} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {alert.label}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{alert.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        pushNotifications: e.target.checked 
                      }))}
                      className="mr-3"
                    />
                    <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Browser Push Notifications
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        emailNotifications: e.target.checked 
                      }))}
                      className="mr-3"
                    />
                    <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                  </div>

                  {notificationSettings.emailNotifications && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={notificationSettings.email}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full max-w-md p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSaveSettings('notifications')}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              <Save size={16} />
              <span>Save Notification Settings</span>
            </button>
          </div>
        )}

        {/* Data & Backup Settings */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data & Backup Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Retention (days)
                </label>
                <select
                  value={dataSettings.retentionDays}
                  onChange={(e) => setDataSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                  <option value={-1}>Forever</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Export Format
                </label>
                <select
                  value={dataSettings.exportFormat}
                  onChange={(e) => setDataSettings(prev => ({ ...prev, exportFormat: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={dataSettings.autoBackup}
                  onChange={(e) => setDataSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                  className="mr-3"
                />
                <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Automatic Backups
                </label>
              </div>

              {dataSettings.autoBackup && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={dataSettings.backupFrequency}
                    onChange={(e) => setDataSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                    className="w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download size={16} />
                <span>Export Data</span>
              </button>

              <button
                onClick={handleImportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Upload size={16} />
                <span>Import Data</span>
              </button>

              <button
                onClick={() => handleSaveSettings('data')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <Save size={16} />
                <span>Save Settings</span>
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Danger Zone</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    This action will permanently delete all your plant data, sensor readings, and configurations.
                  </p>
                  <button
                    onClick={handleClearData}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <RefreshCw size={16} />
                    <span>Clear All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance & Display</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Theme</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleDarkMode}
                    className={`px-4 py-2 rounded-md border ${
                      darkMode
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Dark Mode
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className={`px-4 py-2 rounded-md border ${
                      !darkMode
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Light Mode
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Display Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Temperature Unit
                    </label>
                    <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="celsius">Celsius (°C)</option>
                      <option value="fahrenheit">Fahrenheit (°F)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Format
                    </label>
                    <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Time Format
                    </label>
                    <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSaveSettings('appearance')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Save size={16} />
              <span>Save Appearance Settings</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;