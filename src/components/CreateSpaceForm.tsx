import { User } from '../types';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CreateSpaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function CreateSpaceForm({ isOpen, onClose, user }: CreateSpaceFormProps) {
  const [parentPlace, setParentPlace] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labels, setLabels] = useState({
    title: 'Create a space',
    subtitle: '(Select a different type)',
    question: 'Where would you like to create your space?',
    inputPlaceholder: '',
    browseLink: 'Browse for more places'
  });

  useEffect(() => {
    fetch('/formLabels.json')
      .then(res => res.json())
      .then(data => setLabels(data.space))
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!parentPlace.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('spaces').insert({
        user_id: user.id,
        name: 'New Space',
        parent_place: parentPlace,
      });

      if (error) throw error;

      setParentPlace('');
      onClose();
    } catch (error) {
      console.error('Error creating space:', error);
      alert('Failed to create space');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        style={{ zIndex: 999 }}
        onClick={onClose}
      />
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1000 }}
      >
        <div className="bg-white rounded shadow-xl w-full max-w-md p-6 m-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-500" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {labels.title}
            </span>
          </h2>
          <a href="#" className="text-sm text-blue-600 hover:underline ml-7">{labels.subtitle}</a>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">{labels.question}</h3>
          <input
            type="text"
            value={parentPlace}
            onChange={(e) => setParentPlace(e.target.value)}
            placeholder={labels.inputPlaceholder}
            className="w-full border-b-2 border-blue-500 px-2 py-2 text-sm focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            {labels.browseLink}
          </a>
        </div>
        </div>
      </div>
    </>
  );
}
