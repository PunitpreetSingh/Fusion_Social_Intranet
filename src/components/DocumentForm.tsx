import { X, AtSign, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import { User } from '../types';
import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function DocumentForm({ isOpen, onClose, user }: DocumentFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibilityType, setVisibilityType] = useState('place');
  const [placeName, setPlaceName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [restrictComments, setRestrictComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labels, setLabels] = useState<any>(null);

  useEffect(() => {
    fetch('/formLabels.json')
      .then(res => res.json())
      .then(data => setLabels(data.document))
      .catch(() => {});
  }, []);

  const handlePublish = async (status: "published" | "draft") => {
    if (!title.trim() || !user) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        body: content,
        visibility: {
          type: visibilityType,
          placeName,
        },
        tags: selectedTags,
        restrictComments,
        status,
        createdBy: user.id,
      };

      console.log("Submitting payload:", payload);

      const response = await apiFetch("/api/content/document", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Server response:", response);

      alert(
        status === "published"
          ? "✅ Document published successfully!"
          : "💾 Document saved as draft!"
      );

      setTitle("");
      setContent("");
      setPlaceName("");
      setSelectedTags([]);

      onClose();
    } catch (error: any) {
      console.error("Failed to save document:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !labels) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-100 z-[1000]">
      <div className="min-h-screen">

        {/* HEADER BAR */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
              </svg>
              {labels.title}
            </h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="max-w-5xl mx-auto p-6">

          {/* DOCUMENT DETAILS */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={labels.titlePlaceholder}
              className="w-full text-2xl border-b-2 border-blue-500 pb-2 mb-4 focus:outline-none"
            />

            <div className="border border-gray-300 rounded min-h-[300px] p-4 mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[250px] focus:outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-4 py-2 border rounded text-sm hover:bg-gray-50">
                <AtSign size={16} /> {labels.mentionButton}
              </button>
              <button className="flex items-center gap-1 px-4 py-2 border rounded text-sm hover:bg-gray-50">
                <Paperclip size={16} /> {labels.attachButton}
              </button>
            </div>
          </div>

          {/* VISIBILITY SECTION */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{labels.visibilitySection}</h2>

            {labels.visibilityOptions.map((option: any) => (
              <div key={option.id} className="mb-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={option.id}
                    checked={visibilityType === option.id}
                    onChange={() => setVisibilityType(option.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>

                    {/* PLACE INPUT */}
                    {option.inputPlaceholder && visibilityType === option.id && (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={placeName}
                          onChange={(e) => setPlaceName(e.target.value)}
                          placeholder={option.inputPlaceholder}
                          className="flex-1 border rounded px-3 py-1.5 text-sm"
                        />
                        <button className="px-4 py-1.5 border rounded text-sm hover:bg-gray-50">
                          {option.buttonText}
                        </button>
                      </div>
                    )}

                    {/* SPECIFIC PEOPLE BUTTON */}
                    {option.id === "specific_people" && visibilityType === option.id && (
                      <div className="mt-2">
                        <button className="px-4 py-1.5 border rounded text-sm hover:bg-gray-50">
                          {option.buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* TAG SECTION */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">{labels.tagsSection}</h2>
            <p className="text-sm text-gray-600 mb-3">{labels.tagsDescription}</p>

            <div className="flex flex-wrap gap-2">
              {labels.availableTags.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags(
                      selectedTags.includes(tag)
                        ? selectedTags.filter((t) => t !== tag)
                        : [...selectedTags, tag]
                    )
                  }
                  className={`px-3 py-1 rounded text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ADVANCED OPTIONS */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-lg font-semibold w-full"
            >
              {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              {labels.advancedOptions}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm">{labels.addAuthorsCheckbox}</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restrictComments}
                    onChange={(e) => setRestrictComments(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm">{labels.restrictCommentsCheckbox}</span>
                </label>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => handlePublish("published")}
                disabled={!title.trim() || isSubmitting}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {labels.publishButton}
              </button>

              <button
                onClick={() => handlePublish("draft")}
                disabled={!title.trim() || isSubmitting}
                className="bg-white text-gray-700 px-6 py-2 rounded border hover:bg-gray-50"
              >
                {labels.saveDraftButton}
              </button>

              <button
                onClick={onClose}
                className="bg-white text-gray-700 px-6 py-2 rounded border hover:bg-gray-50"
              >
                {labels.cancelButton}
              </button>
            </div>

            <div className="flex items-center gap-1 text-red-700 text-xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {labels.restrictionMessage}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
