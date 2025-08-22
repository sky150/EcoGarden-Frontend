import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Settings2, Droplets, Thermometer, Upload, Camera, ArrowUpDown } from 'lucide-react';
import PlantSensorAssignment from './PlantSensorAssignment';
import { getPlantMoisture, getPlantTemperature } from '../data/mockData';

const AddPlantModal = ({ isOpen, onClose, onSave, existingPlant = null }) => {
  const [formData, setFormData] = useState({
    name: existingPlant?.name || '',
    species: existingPlant?.species || '',
    location: existingPlant?.location || '',
    plantedDate: existingPlant?.plantedDate || new Date().toISOString().split('T')[0],
    notes: existingPlant?.notes || '',
    photo: existingPlant?.photo || null,
    optimalMoisture: existingPlant?.optimalMoisture || { min: 40, max: 70 },
    optimalTemperature: existingPlant?.optimalTemperature || { min: 18, max: 27 }
  });

  React.useEffect(() => {
    if (existingPlant) {
      setFormData({
        name: existingPlant.name,
        species: existingPlant.species || '',
        location: existingPlant.location,
        plantedDate: existingPlant.plantedDate || new Date().toISOString().split('T')[0],
        notes: existingPlant.notes || '',
        photo: existingPlant.photo || null,
        optimalMoisture: existingPlant.optimalMoisture || { min: 40, max: 70 },
        optimalTemperature: existingPlant.optimalTemperature || { min: 18, max: 27 }
      });
    } else {
      setFormData({
        name: '',
        species: '',
        location: '',
        plantedDate: new Date().toISOString().split('T')[0],
        notes: '',
        photo: null,
        optimalMoisture: { min: 40, max: 70 },
        optimalTemperature: { min: 18, max: 27 }
      });
    }
  }, [existingPlant, isOpen]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const plantData = {
      ...formData,
      id: existingPlant?.id || Date.now(),
      sensorData: existingPlant?.sensorData || {},
      lastWatered: existingPlant?.lastWatered || new Date().toISOString()
    };
    onSave(plantData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {existingPlant ? 'Edit Plant' : 'Add New Plant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plant Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plant Photo
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Plant preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <Upload size={16} />
                  <span>{formData.photo ? 'Change Photo' : 'Upload Photo'}</span>
                </label>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                    className="ml-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plant Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., My Monstera"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Species
              </label>
              <input
                type="text"
                value={formData.species}
                onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value }))}
                placeholder="e.g., Monstera deliciosa"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Living Room"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Planted
              </label>
              <input
                type="date"
                value={formData.plantedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, plantedDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Optimal Moisture Range (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.optimalMoisture.min}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    optimalMoisture: { ...prev.optimalMoisture, min: parseInt(e.target.value) }
                  }))}
                  placeholder="Min"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={formData.optimalMoisture.max}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    optimalMoisture: { ...prev.optimalMoisture, max: parseInt(e.target.value) }
                  }))}
                  placeholder="Max"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Optimal Temperature Range (°C)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.optimalTemperature.min}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    optimalTemperature: { ...prev.optimalTemperature, min: parseInt(e.target.value) }
                  }))}
                  placeholder="Min"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={formData.optimalTemperature.max}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    optimalTemperature: { ...prev.optimalTemperature, max: parseInt(e.target.value) }
                  }))}
                  placeholder="Max"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Plant care notes, observations, etc."
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {existingPlant ? 'Update Plant' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlantsPage = ({ 
  plants, 
  sensors, 
  plantSensorAssignments, 
  onPlantUpdate, 
  onTogglePump, 
  onViewDetails,
  onPlantSensorAssignment 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showSensorAssignment, setShowSensorAssignment] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'location', 'species', 'planted'

  const filteredAndSortedPlants = plants
    .filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'species':
          return (a.species || '').localeCompare(b.species || '');
        case 'planted':
          return new Date(b.plantedDate || 0) - new Date(a.plantedDate || 0);
        default:
          return 0;
      }
    });

  const handlePlantSave = (plantData) => {
    onPlantUpdate(plantData);
    setEditingPlant(null);
  };

  const handlePlantEdit = (plant) => {
    setEditingPlant(plant);
    setShowAddPlant(true);
  };

  const handlePlantDelete = (plantId) => {
    if (window.confirm('Are you sure you want to delete this plant? This will remove all sensor assignments.')) {
      onPlantUpdate({ id: plantId, _delete: true });
    }
  };

  const handleSensorAssignmentOpen = (plant) => {
    setSelectedPlant(plant);
    setShowSensorAssignment(true);
  };

  const handleAssignSensor = (plantId, sensorId, role) => {
    onPlantSensorAssignment({ plantId, sensorId, role, action: 'assign' });
  };

  const handleUnassignSensor = (plantId, sensorId, role) => {
    onPlantSensorAssignment({ plantId, sensorId, role, action: 'unassign' });
  };

  const getPlantStats = () => {
    const total = plants.length;
    const needWater = plants.filter(p => {
      const moisture = getPlantMoisture(p);
      return moisture && moisture < p.optimalMoisture.min;
    }).length;
    const withSensors = plants.filter(p => 
      plantSensorAssignments.some(a => a.plantId === p.id)
    ).length;
    
    return { total, needWater, withSensors };
  };

  const stats = getPlantStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your garden plants and configure sensor assignments
          </p>
        </div>
        
        <button
          onClick={() => setShowAddPlant(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={16} />
          <span>Add Plant</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Droplets className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Thermometer className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Need Water</p>
              <p className="text-2xl font-bold text-blue-600">{stats.needWater}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Settings2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Sensors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.withSensors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="location">Sort by Location</option>
              <option value="species">Sort by Species</option>
              <option value="planted">Sort by Date Planted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Plants Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plant</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Health Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sensors</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAndSortedPlants.map(plant => {
                const moisture = getPlantMoisture(plant);
                const temperature = getPlantTemperature(plant);
                const sensorCount = plantSensorAssignments.filter(a => a.plantId === plant.id).length;
                const daysSincePlanted = plant.plantedDate ? 
                  Math.floor((new Date() - new Date(plant.plantedDate)) / (1000 * 60 * 60 * 24)) : null;
                
                return (
                  <tr key={plant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {plant.photo ? (
                            <img
                              src={plant.photo}
                              alt={plant.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                              <Droplets className="w-6 h-6 text-green-600 dark:text-green-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {plant.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {plant.species || 'Unknown species'}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{plant.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        {daysSincePlanted !== null && (
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{daysSincePlanted}</span> days old
                          </div>
                        )}
                        <div className="text-gray-500 dark:text-gray-500 text-xs">
                          Optimal: {plant.optimalMoisture.min}-{plant.optimalMoisture.max}% moisture
                        </div>
                        <div className="text-gray-500 dark:text-gray-500 text-xs">
                          {plant.optimalTemperature.min}-{plant.optimalTemperature.max}°C temp
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Droplets size={14} className="text-blue-500" />
                          <span className={`text-sm font-medium ${
                            moisture === null ? 'text-gray-400' :
                            moisture < plant.optimalMoisture.min ? 'text-red-600' :
                            moisture > plant.optimalMoisture.max ? 'text-blue-600' :
                            'text-green-600'
                          }`}>
                            {moisture !== null ? `${moisture}%` : 'No Data'}
                          </span>
                          {moisture !== null && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              moisture < plant.optimalMoisture.min ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                              moisture > plant.optimalMoisture.max ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {moisture < plant.optimalMoisture.min ? 'Low' :
                               moisture > plant.optimalMoisture.max ? 'High' : 'Good'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Thermometer size={14} className="text-orange-500" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {temperature !== null ? `${temperature}°C` : 'No Data'}
                          </span>
                          {temperature !== null && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              temperature < plant.optimalTemperature.min || temperature > plant.optimalTemperature.max
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {temperature < plant.optimalTemperature.min || temperature > plant.optimalTemperature.max ? 'Suboptimal' : 'Good'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{sensorCount}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          sensor{sensorCount !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => handleSensorAssignmentOpen(plant)}
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 p-1"
                          title="Manage sensors"
                        >
                          <Settings2 size={14} />
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onViewDetails(plant)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
                          title="View trends"
                        >
                          View Trends
                        </button>
                        <button
                          onClick={() => handlePlantEdit(plant)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 p-1"
                          title="Edit plant"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handlePlantDelete(plant.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 p-1"
                          title="Delete plant"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedPlants.length === 0 && (
        <div className="text-center py-12">
          <Droplets size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No plants found' : 'No plants yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Add your first plant to start monitoring your garden.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddPlant(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={16} />
              <span>Add Your First Plant</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddPlantModal
        isOpen={showAddPlant}
        onClose={() => {
          setShowAddPlant(false);
          setEditingPlant(null);
        }}
        onSave={handlePlantSave}
        existingPlant={editingPlant}
      />

      {selectedPlant && (
        <PlantSensorAssignment
          plant={selectedPlant}
          sensors={sensors}
          currentAssignments={plantSensorAssignments}
          onAssignSensor={handleAssignSensor}
          onUnassignSensor={handleUnassignSensor}
          isOpen={showSensorAssignment}
          onClose={() => {
            setShowSensorAssignment(false);
            setSelectedPlant(null);
          }}
        />
      )}
    </div>
  );
};

export default PlantsPage;