import { useState, useEffect } from 'react';
import { Search, X, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Place {
  id: string;
  name: string;
  parent_place: string;
  created_at: string;
}

interface PlaceSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (place: Place) => void;
}

export function PlaceSearch({ isOpen, onClose, onSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      searchPlaces('');
    }
  }, [isOpen]);

  const searchPlaces = async (searchQuery: string) => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('spaces')
        .select('*')
        .limit(20)
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setPlaces(data || []);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchPlaces(value);
  };

  const handleSelect = (place: Place) => {
    onSelect(place);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Browse Places</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search places..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Searching...</div>
          ) : places.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No places found</div>
          ) : (
            <div className="space-y-2">
              {places.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelect(place)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{place.name}</div>
                    {place.parent_place && (
                      <div className="text-sm text-gray-500">{place.parent_place}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
