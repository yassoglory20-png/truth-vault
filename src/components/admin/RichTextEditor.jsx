import { useRef, useState } from 'react';
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Quote, Link, Image, Code, Undo, Redo } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder = 'Write your article...' }) {
  const editorRef = useRef(null);
  const [activeCommands, setActiveCommands] = useState(new Set());

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveCommands();
  };

  const updateActiveCommands = () => {
    const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];
    const active = new Set();
    commands.forEach(cmd => { if (document.queryCommandState(cmd)) active.add(cmd); });
    setActiveCommands(active);
  };

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || '';
    onChange(content);
    updateActiveCommands();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) execCommand('insertImage', url);
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { divider: true },
    { icon: Heading2, command: 'formatBlock', value: 'H2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'H3', title: 'Heading 3' },
    { divider: true },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { divider: true },
    { icon: Link, action: insertLink, title: 'Insert Link' },
    { icon: Image, action: insertImage, title: 'Insert Image' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { divider: true },
    { icon: Undo, command: 'undo', title: 'Undo' },
    { icon: Redo, command: 'redo', title: 'Redo' },
  ];

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        {toolbarButtons.map((btn, index) =>
          btn.divider ? <div key={index} className="w-px h-6 bg-vault-300 dark:bg-vault-600 mx-1" />
            : <button key={btn.title} type="button" onClick={() => btn.action ? btn.action() : execCommand(btn.command, btn.value)} className={activeCommands.has(btn.command) ? 'active' : ''} title={btn.title}><btn.icon className="w-4 h-4" /></button>
        )}
      </div>
      <div ref={editorRef} className="editor-content" contentEditable onInput={handleInput} onKeyUp={updateActiveCommands} onMouseUp={updateActiveCommands} data-placeholder={placeholder} dangerouslySetInnerHTML={{ __html: value }} role="textbox" aria-multiline="true" aria-label="Article content editor" />
    </div>
  );
}
