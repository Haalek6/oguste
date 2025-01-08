import { useState, useRef, useEffect } from 'react';
import { ChevronDown, HelpCircle, Settings, Plus, Search } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';

export function MainHeader() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedProperty, setSelectedProperty, properties } = useProperty();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPropertyMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Escape') {
        setIsPropertyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="bg-white border-b">
      <div className="h-14 flex items-center pl-4 space-x-8">
        <span className="text-lg font-semibold text-gray-900">Oguste</span>
        
        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center space-x-2">
          <HelpCircle className="h-4 w-4" />
          <span>Aide</span>
        </button>
        
        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Paramètres</span>
        </button>

        {/* Sélecteur de bien */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsPropertyMenuOpen(!isPropertyMenuOpen)}
            className="flex items-center space-x-2 text-sm hover:bg-gray-50 px-4 py-2 rounded-md border border-gray-200"
          >
            <span className="font-medium text-gray-700">
              {selectedProperty.address}, {selectedProperty.city}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Menu déroulant */}
          {isPropertyMenuOpen && (
            <div className="absolute left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un bien..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {properties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsPropertyMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{property.address}, {property.city}</span>
                    {selectedProperty.id === property.id && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t mt-2 pt-2 px-3">
                <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Ajouter un bien</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
