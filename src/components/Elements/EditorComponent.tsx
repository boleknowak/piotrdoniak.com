/* eslint-disable no-return-assign */
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

export default function EditorComponent({ onUpdate }: { onUpdate: (content: string) => void }) {
  const editorRef = useRef(null);

  const updateContent = () => {
    if (editorRef.current) {
      onUpdate(editorRef.current.getContent());
    }
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      onEditorChange={updateContent}
      initialValue="<p></p>"
      init={{
        height: 400,
        skin: 'oxide',
        menubar: true,
        plugins: [
          'advlist',
          'autolink',
          'autosave',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  );
}
