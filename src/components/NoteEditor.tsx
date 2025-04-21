import { useState, useEffect } from 'react';
import { useNoteStore, Note } from '../stores/noteStore';
import { format } from 'date-fns';
import { Save, X, Trash2, Sparkles } from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  isNew?: boolean;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, isNew = false, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { addNote, updateNote, deleteNote, summarizeNote, isLoading } = useNoteStore();

  // Initialize form with note data when provided
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNew) {
      await addNote(title, content);
      onCancel(); // Close the editor after adding
    } else if (note) {
      await updateNote(note.id, { title, content });
    }
  };

  const handleDelete = async () => {
    if (note && confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note.id);
      onCancel();
    }
  };

  const handleSummarize = async () => {
    if (!note) return;
    
    setIsSummarizing(true);
    await summarizeNote(note.id);
    setIsSummarizing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="border-b border-gray-200 py-3 px-4 sm:px-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {isNew ? 'Create Note' : 'Edit Note'}
          </h2>
          {note && (
            <p className="mt-1 text-xs text-gray-500">
              Last updated {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isNew && note && (
            <button
              type="button"
              onClick={handleSummarize}
              disabled={isSummarizing || isLoading}
              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSummarizing ? (
                <>
                  <div className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-1" />
                  Summarize
                </>
              )}
            </button>
          )}
          {!isNew && note && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <X size={16} className="mr-1" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || title.trim() === '' || content.trim() === ''}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-blue-400"
          >
            <Save size={16} className="mr-1" />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white border p-2"
              placeholder="Note title"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white border p-2 resize-none"
              placeholder="Write your note here..."
              required
            />
          </div>

          {note?.summary && (
            <div>
              <div className="flex items-center mb-2">
                <Sparkles size={16} className="text-blue-600 mr-1.5" />
                <label className="block text-sm font-medium text-gray-700">
                  AI Summary
                </label>
              </div>
              <div className="bg-blue-50 rounded-md p-4 text-sm text-gray-800 border border-blue-100">
                {note.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default NoteEditor;