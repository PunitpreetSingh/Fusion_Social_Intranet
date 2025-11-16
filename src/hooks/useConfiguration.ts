import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AppConfiguration } from '../types';

export function useConfiguration() {
  const [config, setConfig] = useState<AppConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const { data, error } = await supabase
          .from('app_configuration')
          .select('config_key, config_value')
          .in('config_key', ['header_config', 'profile_modal_config', 'app_search_config', 'create_content_config']);

        if (error) throw error;

        const configObject = data.reduce((acc, item) => {
          acc[item.config_key as keyof AppConfiguration] = item.config_value;
          return acc;
        }, {} as AppConfiguration);

        setConfig(configObject);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching configuration:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, []);

  return { config, loading, error };
}
