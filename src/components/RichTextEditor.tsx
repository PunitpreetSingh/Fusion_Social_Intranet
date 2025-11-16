import { useState, useRef } from 'react';
import { Bold, Italic, Link as LinkIcon, AtSign, Image as ImageIcon, Paperclip, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onMentionClick?: () => void;
  onAttachClick?: () => void;
  showAttachButton?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'What\'s on your mind?',
  onMentionClick,
  onAttachClick,
  showAttachButton = false
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const selection = window.getSelection();
      const text = selection?.toString() || url;
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${text}</a>`);
    }
    editorRef.current?.focus();
  };

  const handleMention = () => {
    if (onMentionClick) {
      onMentionClick();
    } else {
      const mention = prompt('Enter name to mention:');
      if (mention) {
        document.execCommand('insertHTML', false, `<span class="text-blue-600 font-semibold">@${mention}</span>&nbsp;`);
      }
      editorRef.current?.focus();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `content-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = `<img src="${event.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
          document.execCommand('insertHTML', false, img);
          onChange(editorRef.current?.innerHTML || '');
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      const img = `<img src="${urlData.publicUrl}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
      document.execCommand('insertHTML', false, img);
      onChange(editorRef.current?.innerHTML || '');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Underline (Ctrl+U)"
        >
          <span className="text-gray-700 font-semibold text-sm underline">U</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => handleFormat('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={handleLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <LinkIcon size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={handleMention}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Mention User"
        >
          <AtSign size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Upload Image"
        >
          <ImageIcon size={18} className="text-gray-700" />
        </button>

        {showAttachButton && onAttachClick && (
          <button
            type="button"
            onClick={onAttachClick}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Attach File"
          >
            <Paperclip size={18} className="text-gray-700" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {uploading && (
          <span className="text-xs text-gray-500 ml-2">Uploading...</span>
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[150px] max-h-[400px] overflow-y-auto focus:outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
