import { User } from '../types';
import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

interface CreateSpaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function CreateSpaceForm({ isOpen, onClose, user }: CreateSpaceFormProps) {
  const [spaceName, setSpaceName] = useState('');
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
    if (!spaceName.trim() || !user) {
      alert('Please enter a space name');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: spaceName.trim(),
        createdBy: user.id,
        parent_place: parentPlace.trim() || null
      };

      console.log("Submitting Space:", payload);

      const response = await apiFetch("/api/spaces", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      console.log("Response:", response);

      alert("✅ Space created successfully!");

      setSpaceName('');
      setParentPlace('');
      onClose();
      
    } catch (error: any) {
      console.error("Error creating space:", error);
      alert(`❌ Failed to create space: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-[1000]"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-white rounded shadow-xl w-full max-w-md p-6 m-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-500" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {labels.title}
              </span>
            </h2>

            <a className="text-sm text-blue-600 hover:underline ml-7">
              {labels.subtitle}
            </a>
          </div>

          {/* SPACE NAME */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Space Name *</label>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="Enter space name"
              className="w-full border-b-2 border-blue-500 px-2 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* PARENT PLACE */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">{labels.question}</h3>

            <input
              value={parentPlace}
              onChange={(e) => setParentPlace(e.target.value)}
              placeholder={labels.inputPlaceholder || "Enter parent place (optional)"}
              className="w-full border-b-2 border-blue-500 px-2 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <a className="text-sm text-blue-600 hover:underline">
              {labels.browseLink}
            </a>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              disabled={!spaceName.trim() || isSubmitting}
              onClick={handleCreate}
              className="bg-black text-white px-6 py-2 text-sm rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Space"}
            </button>

            <button
              onClick={() => {
                setSpaceName('');
                setParentPlace('');
                onClose();
              }}
              className="bg-white text-gray-700 px-6 py-2 text-sm rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
