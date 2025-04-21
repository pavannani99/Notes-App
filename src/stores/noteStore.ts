import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  selectedNote: Note | null;
  viewType: 'grid' | 'list';
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<Note | null>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
  setViewType: (type: 'grid' | 'list') => void;
  summarizeNote: (id: string) => Promise<string>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  selectedNote: null,
  viewType: 'grid',
  
  fetchNotes: async () => {
    set({ isLoading: true });
    
    try {
      // Get the current user first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        set({ isLoading: false, notes: [] });
        return;
      }
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notes:', error);
        set({ isLoading: false });
        return;
      }
      
      set({ notes: data as Note[], isLoading: false });
    } catch (err) {
      console.error('Error in fetchNotes:', err);
      set({ isLoading: false });
    }
  },
  
  addNote: async (title: string, content: string) => {
    set({ isLoading: true });
    
    try {
      // Get the current user first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        set({ isLoading: false });
        return null;
      }
      
      const newNote = {
        title,
        content,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select();
      
      if (error) {
        console.error('Error adding note:', error);
        set({ isLoading: false });
        return null;
      }
      
      const createdNote = data[0] as Note;
      set((state) => ({ notes: [createdNote, ...state.notes], isLoading: false }));
      return createdNote;
    } catch (err) {
      console.error('Error in addNote:', err);
      set({ isLoading: false });
      return null;
    }
  },
  
  updateNote: async (id: string, updates: Partial<Note>) => {
    set({ isLoading: true });
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating note:', error);
        set({ isLoading: false });
        return;
      }
      
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? { ...note, ...updates } as Note : note)),
        selectedNote: state.selectedNote?.id === id ? { ...state.selectedNote, ...updates } as Note : state.selectedNote,
        isLoading: false,
      }));
    } catch (err) {
      console.error('Error in updateNote:', err);
      set({ isLoading: false });
    }
  },
  
  deleteNote: async (id: string) => {
    set({ isLoading: true });
    
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting note:', error);
        set({ isLoading: false });
        return;
      }
      
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
        isLoading: false,
      }));
    } catch (err) {
      console.error('Error in deleteNote:', err);
      set({ isLoading: false });
    }
  },
  
  setSelectedNote: (note) => {
    set({ selectedNote: note });
  },
  
  setViewType: (type) => {
    set({ viewType: type });
  },
  
  summarizeNote: async (id: string) => {
    set({ isLoading: true });
    const note = get().notes.find(n => n.id === id);
    
    if (!note) {
      set({ isLoading: false });
      return "Note not found";
    }
    
    try {
      // This would be replaced with an actual API call to an AI service
      // For demo purposes, we're simulating the API call
      const summary = await simulateAISummarization(note.content);
      
      // Update the note with the summary
      await get().updateNote(id, { summary });
      
      set({ isLoading: false });
      return summary;
    } catch (error) {
      console.error('Error summarizing note:', error);
      set({ isLoading: false });
      return "Failed to generate summary";
    }
  }
}));

// Placeholder function to simulate AI summarization
// This would be replaced with an actual API call in production
async function simulateAISummarization(content: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple summarization logic for demonstration
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      let summary = '';
      
      if (sentences.length <= 2) {
        summary = content;
      } else {
        // Take the first sentence and one from the middle
        summary = `${sentences[0]}. ${sentences[Math.floor(sentences.length / 2)]}.`;
        
        // If there are more than 4 sentences, add the last one too
        if (sentences.length > 4) {
          summary += ` ${sentences[sentences.length - 1]}.`;
        }
      }
      
      resolve(summary);
    }, 1500); // Simulate API delay
  });
}