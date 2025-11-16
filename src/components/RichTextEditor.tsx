import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AtSign, Paperclip } from 'lucide-react';

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
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }), []);

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="quill-editor"
      />
      <div className="flex gap-2 p-2 border-t border-gray-200">
        {onMentionClick && (
          <button
            type="button"
            onClick={onMentionClick}
            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            <AtSign size={16} />
            Mention
          </button>
        )}
        {showAttachButton && onAttachClick && (
          <button
            type="button"
            onClick={onAttachClick}
            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            <Paperclip size={16} />
            Attach
          </button>
        )}
      </div>
      <style>{`
        .quill-editor .ql-container {
          min-height: 150px;
          font-size: 14px;
        }
        .quill-editor .ql-editor {
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}
