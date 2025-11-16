import { useRef, useCallback } from 'react';
import { Bold, Italic, Link as LinkIcon, AtSign, Image as ImageIcon, Paperclip, List, ListOrdered } from 'lucide-react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const insertText = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [onChange]);

  const handleBold = useCallback(() => {
    insertText('**bold text**');
  }, [insertText]);

  const handleItalic = useCallback(() => {
    insertText('*italic text*');
  }, [insertText]);

  const handleLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      insertText(`[link text](${url})`);
    }
  }, [insertText]);

  const handleMention = useCallback(() => {
    if (onMentionClick) {
      onMentionClick();
    } else {
      const mention = prompt('Enter name to mention:');
      if (mention) {
        insertText(`@${mention} `);
      }
    }
  }, [onMentionClick, insertText]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    insertText('[Uploading image...]');

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

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);

        const newValue = value.replace('[Uploading image...]', `![Image](${urlData.publicUrl})`);
        onChange(newValue);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  }, [value, onChange, insertText]);

  const handleList = useCallback(() => {
    insertText('\n- List item\n');
  }, [insertText]);

  const handleOrderedList = useCallback(() => {
    insertText('\n1. List item\n');
  }, [insertText]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={handleBold}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={handleList}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={handleOrderedList}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={18} className="text-gray-700" />
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
          className="p-2 hover:bg-gray-200 rounded transition-colors"
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
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-4 min-h-[150px] max-h-[400px] resize-none focus:outline-none"
      />
    </div>
  );
}
