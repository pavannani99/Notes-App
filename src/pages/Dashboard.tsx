import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNoteStore, Note } from '../stores/noteStore';
import { supabase } from '../lib/supabaseClient';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';
import { LogOut, Plus, LayoutGrid, List as ListIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { 
    notes, 
    fetchNotes, 
    selectedNote, 
    setSelectedNote, 
    viewType,
    setViewType,
    isLoading 
  } = useNoteStore();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AI-Powered Notes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">My Notes</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-1.5 rounded-md ${viewType === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-1.5 rounded-md ${viewType === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
            <button
              onClick={handleCreateNew}
              className="w-full flex items-center justify-center gap-1.5 rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Plus size={16} />
              New Note
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-9.5rem)]">
            <NoteList 
              notes={notes} 
              selectedNote={selectedNote} 
              onSelectNote={setSelectedNote}
              viewType={viewType}
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-white lg:bg-gray-50 p-0 lg:p-6">
          <div className="h-full flex items-center justify-center">
            {isCreating || selectedNote ? (
              <div className="w-full max-w-3xl bg-white rounded-lg shadow lg:border border-gray-200 overflow-hidden">
                <NoteEditor 
                  key={selectedNote?.id || 'new-note'} 
                  note={selectedNote}
                  isNew={isCreating}
                  onCancel={handleCancelCreate}
                />
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No note selected</h3>
                <p className="text-gray-600 mb-6">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <Plus size={16} />
                  Create New Note
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;