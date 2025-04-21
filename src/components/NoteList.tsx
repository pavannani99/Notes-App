import { format } from 'date-fns';
import { Note } from '../stores/noteStore';
import { FileText, AlignLeft, Sparkles } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  viewType: 'grid' | 'list';
  isLoading: boolean;
}

const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  viewType,
  isLoading
}) => {
  if (isLoading && notes.length === 0) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4">
        <FileText size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">No notes yet. Create your first note!</p>
      </div>
    );
  }

  if (viewType === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`cursor-pointer rounded-lg border ${
              selectedNote?.id === note.id 
                ? 'border-blue-500 ring-1 ring-blue-500' 
                : 'border-gray-200 hover:border-gray-300'
            } bg-white shadow-sm transition-all duration-200 overflow-hidden flex flex-col`}
          >
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
              <div className="flex items-center mt-1">
                <time dateTime={note.updated_at} className="text-xs text-gray-500">
                  {format(new Date(note.updated_at), 'MMM d, yyyy')}
                </time>
                {note.summary && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                    <Sparkles size={10} className="mr-0.5" />
                    Summarized
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 text-sm text-gray-600 line-clamp-3 flex-1">
              {note.content}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`cursor-pointer p-4 transition-colors duration-150 ${
            selectedNote?.id === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className={`p-2 rounded-md ${selectedNote?.id === note.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                <AlignLeft size={16} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate">{note.title}</h3>
                <time dateTime={note.updated_at} className="flex-shrink-0 text-xs text-gray-500">
                  {format(new Date(note.updated_at), 'MMM d, yyyy')}
                </time>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{note.content}</p>
              {note.summary && (
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    <Sparkles size={10} className="mr-1" />
                    Summarized
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;