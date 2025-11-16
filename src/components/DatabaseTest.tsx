import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function DatabaseTest() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [users, setUsers] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('name');

      if (usersError) throw usersError;

      // Test 2: Fetch spaces
      const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select('*')
        .order('name');

      if (spacesError) throw spacesError;

      setUsers(usersData || []);
      setSpaces(spacesData || []);
      setStatus('✅ Backend Connected Successfully!');
    } catch (err: any) {
      console.error('Database error:', err);
      setError(err.message);
      setStatus('❌ Connection Failed');
    }
  };

  const createTestStatus = async () => {
    if (users.length === 0) {
      alert('No users found. Cannot create status.');
      return;
    }

    const firstUser = users[0];
    try {
      const { data, error } = await supabase
        .from('status_updates')
        .insert({
          user_id: firstUser.id,
          content: '<p>Test status from frontend - ' + new Date().toLocaleString() + '</p>',
          post_in: 'Engineering'
        })
        .select()
        .single();

      if (error) throw error;

      alert('✅ Status created successfully!\n\nID: ' + data.id);
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
      console.error(err);
    }
  };

  const createTestDocument = async () => {
    if (users.length === 0) {
      alert('No users found. Cannot create document.');
      return;
    }

    const firstUser = users[0];
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: firstUser.id,
          title: 'Test Document - ' + new Date().toLocaleString(),
          content: 'This is a test document created from the frontend.',
          visibility_type: 'place',
          place_name: 'Engineering',
          tags: ['test', 'demo'],
          status: 'published',
          restrict_comments: false
        })
        .select()
        .single();

      if (error) throw error;

      alert('✅ Document created successfully!\n\nID: ' + data.id);
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-6 max-w-md border-2 border-gray-200 z-50">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Database Connection Test</h2>
        <p className={`text-lg font-semibold ${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
          {status}
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {users.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Users ({users.length}):</h3>
          <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
            {users.map(user => (
              <div key={user.id} className="text-sm py-1 flex justify-between">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-gray-500 px-2 py-0.5 bg-white rounded">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {spaces.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Spaces ({spaces.length}):</h3>
          <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
            {spaces.map(space => (
              <div key={space.id} className="text-sm py-1">
                <span className="font-medium">{space.name}</span>
                {space.parent_place && (
                  <span className="text-xs text-gray-500 ml-2">
                    (in {space.parent_place})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={createTestStatus}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Create Test Status
        </button>
        <button
          onClick={createTestDocument}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Create Test Document
        </button>
        <button
          onClick={testConnection}
          className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Refresh Data
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Backend: Supabase (PostgreSQL)<br/>
          Status: {users.length > 0 ? 'Connected & Ready' : 'Loading...'}
        </p>
      </div>
    </div>
  );
}
