import { useState, useEffect } from 'react';
import { Search, X, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: User) => void;
  multiple?: boolean;
  selectedUsers?: User[];
}

export function UserSearch({ isOpen, onClose, onSelect, multiple = false, selectedUsers = [] }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<User[]>(selectedUsers);

  useEffect(() => {
    if (isOpen) {
      searchUsers('');
    }
  }, [isOpen]);

  const searchUsers = async (searchQuery: string) => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('users')
        .select('*')
        .limit(20);

      if (searchQuery.trim()) {
        queryBuilder = queryBuilder.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,department.ilike.%${searchQuery}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchUsers(value);
  };

  const handleSelect = (user: User) => {
    if (multiple) {
      const isSelected = selected.some(u => u.id === user.id);
      if (isSelected) {
        setSelected(selected.filter(u => u.id !== user.id));
      } else {
        setSelected([...selected, user]);
      }
    } else {
      onSelect(user);
      onClose();
    }
  };

  const handleDone = () => {
    if (multiple) {
      selected.forEach(user => onSelect(user));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {multiple ? 'Select People' : 'Select Person'}
          </h2>
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
              placeholder="Search by name, email, or department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Searching...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No users found</div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => {
                const isSelected = selected.some(u => u.id === user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {user.profile_image_url ? (
                        <img
                          src={user.profile_image_url}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.department && (
                        <div className="text-xs text-gray-400">{user.department}</div>
                      )}
                    </div>
                    {multiple && isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {multiple && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {selected.length} {selected.length === 1 ? 'person' : 'people'} selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
