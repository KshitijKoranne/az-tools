"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Copy, Edit, Plus, Save, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        if (parsedNotes.length > 0) {
          setActiveNote(parsedNotes[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditMode(true);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note,
    );
    setNotes(updatedNotes);
    setActiveNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNote?.id === id) {
      setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      setEditMode(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeNote) {
      const updatedNote = {
        ...activeNote,
        title: e.target.value,
        updatedAt: Date.now(),
      };
      updateNote(updatedNote);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeNote) {
      const updatedNote = {
        ...activeNote,
        content: e.target.value,
        updatedAt: Date.now(),
      };
      updateNote(updatedNote);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const copyToClipboard = () => {
    if (activeNote) {
      const textToCopy = `${activeNote.title}\n\n${activeNote.content}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Notes</h1>
            <p className="text-muted-foreground">
              Create and save quick notes for your ideas and tasks.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border-r pr-6">
                <div className="flex items-center justify-between mb-4">
                  <Input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={createNewNote} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="h-[400px] overflow-y-auto">
                  {filteredNotes.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      No notes found
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {filteredNotes.map((note) => (
                        <li
                          key={note.id}
                          className={`p-3 rounded-md cursor-pointer ${activeNote?.id === note.id ? "bg-primary/10" : "hover:bg-muted/50"}`}
                          onClick={() => {
                            setActiveNote(note);
                            setEditMode(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium truncate">
                              {note.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className="h-6 w-6 -mt-1 -mr-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {note.content.substring(0, 60)}
                            {note.content.length > 60 ? "..." : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                {activeNote ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {editMode ? (
                        <Input
                          type="text"
                          value={activeNote.title}
                          onChange={handleTitleChange}
                          className="text-xl font-bold"
                        />
                      ) : (
                        <h2 className="text-xl font-bold">
                          {activeNote.title}
                        </h2>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleEditMode}
                        >
                          {editMode ? (
                            <Save className="h-4 w-4" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNote(activeNote.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-4">
                      Created: {formatDate(activeNote.createdAt)}
                      <br />
                      Last updated: {formatDate(activeNote.updatedAt)}
                    </div>

                    {editMode ? (
                      <textarea
                        value={activeNote.content}
                        onChange={handleContentChange}
                        className="w-full h-[300px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Write your note here..."
                      />
                    ) : (
                      <div className="w-full h-[300px] p-3 border rounded-md overflow-y-auto whitespace-pre-wrap">
                        {activeNote.content || (
                          <span className="text-muted-foreground">
                            No content. Click the edit button to add content.
                          </span>
                        )}
                      </div>
                    )}

                    {copied && (
                      <div className="mt-2 text-sm text-green-600">
                        Note copied to clipboard!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <p className="mb-4">No note selected</p>
                    <Button onClick={createNewNote}>
                      <Plus className="h-4 w-4 mr-2" /> Create New Note
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Click the "+" button to create a new note.</li>
              <li>Click on a note in the sidebar to view it.</li>
              <li>Click the edit button to modify the note's content.</li>
              <li>Use the search box to find specific notes.</li>
              <li>Click the copy button to copy the note to your clipboard.</li>
              <li>Click the delete button to remove a note.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your notes are saved locally in your
                browser. They will persist between sessions but are not synced
                across devices.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
