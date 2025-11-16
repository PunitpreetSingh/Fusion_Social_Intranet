import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            setUser(data);
          } else {
            const mockUser: User = {
              id: authUser.id,
              email: authUser.email || '',
              name: 'Mohit Verma',
              department: 'IT/IAS-C',
              profile_image_url: '',
              role: 'internal',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUser(mockUser);
          }
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching user:', err);

        const mockUser: User = {
          id: 'mock-user-id',
          email: 'mohit.verma@example.com',
          name: 'Mohit Verma',
          department: 'IT/IAS-C',
          profile_image_url: '',
          role: 'internal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
