'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  label,
  height = '300px'
}: RichTextEditorProps) {
  const [editorHtml, setEditorHtml] = useState(value);

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onChange(html);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div style={{ height }}>
        <ReactQuill
          theme="snow"
          value={editorHtml}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}
