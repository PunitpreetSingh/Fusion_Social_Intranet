import { X } from 'lucide-react';
import { User } from '../types';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RichTextEditor } from './RichTextEditor';
import { PlaceSearch } from './PlaceSearch';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function StatusUpdateModal({ isOpen, onClose, user }: StatusUpdateModalProps) {
  const [content, setContent] = useState('');
  const [postIn, setPostIn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [labels, setLabels] = useState({
    title: 'Post a status update',
    postInLabel: 'Post in',
    postInPlaceholder: 'Enter the name of Space',
    postButton: 'Post',
    cancelButton: 'Cancel',
    restrictionMessage: 'INTERNAL ONLY'
  });

  useEffect(() => {
    fetch('/formLabels.json')
      .then(res => res.json())
      .then(data => setLabels(data.statusUpdate))
      .catch(() => {});
  }, []);

  const handlePost = async () => {
    if (!content.trim() || !user) return;

    if (user.role !== 'internal') {
      alert('Only internal users can post status updates');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('status_updates').insert({
        user_id: user.id,
        content: content,
        post_in: postIn,
      });

      if (error) throw error;

      setContent('');
      setPostIn('');
      onClose();
    } catch (error) {
      console.error('Error posting status update:', error);
      alert('Failed to post status update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setPostIn('');
    onClose();
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
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded shadow-xl w-full max-w-2xl m-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">{labels.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                {user?.profile_image_url ? (
                  <img src={user.profile_image_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="What's on your mind?"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-700">{labels.postInLabel}:</label>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={postIn}
                    onChange={(e) => setPostIn(e.target.value)}
                    placeholder={labels.postInPlaceholder}
                    className="flex-1 border-b border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={() => setShowPlaceSearch(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handlePost}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-black text-white px-6 py-2 text-sm rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? 'Posting...' : labels.postButton}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white text-gray-700 px-6 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {labels.cancelButton}
                </button>
              </div>

              <div className="flex items-center gap-1 text-red-700">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span className="text-xs font-medium">{labels.restrictionMessage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlaceSearch
        isOpen={showPlaceSearch}
        onClose={() => setShowPlaceSearch(false)}
        onSelect={(place) => {
          setPostIn(place.name);
          setShowPlaceSearch(false);
        }}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
