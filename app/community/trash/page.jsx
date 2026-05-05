"use client";

import React, { useEffect, useState } from "react";
import { RotateCcw, Trash2, FileText } from "lucide-react";
import { useNoteStore } from "../../../store/useNoteStore";

const TrashPage = () => {
  const { trashNotes, trashNote,deleteForever } = useNoteStore();
  const [trashNoteList, setTrashNoteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrashNotes = async () => {
      const res = await trashNotes();
      setTrashNoteList(res || []);
      setIsLoading(false);
    };
    fetchTrashNotes();
  }, [trashNotes]);

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-300">
        Loading trashed notes...
      </div>
    );
  }

  /* ---------------- HANDLERS ---------------- */

  const handleRestore = async(noteId) => {
    await trashNote(noteId);
    setTrashNoteList(prev => prev.filter(note => note.id !== noteId));
  };

  const handleDeleteForever = async(noteId) => {
    await deleteForever(noteId);
    setTrashNoteList(prev => prev.filter(note => note.id !== noteId));

  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-100 mb-4">
          Trash
        </h1>

        {/* Desktop Table */}
        <div className="hidden md:block bg-slate-900 rounded-lg border border-slate-800 shadow">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-slate-800 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Restore</th>
                <th className="px-4 py-3 text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {trashNoteList.length === 0 && (
                <tr key="no-trash">
                  <td
                    colSpan="4"
                    className="py-10 text-center text-gray-500"
                  >
                    Trash is empty
                  </td>
                </tr>
              )}

              {trashNoteList.map((note) => (
                <tr
                  key={note.id}
                  className="border-t border-slate-800 hover:bg-slate-800 transition"
                >
                  {/* ID */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {note.id}
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-200">
                      {note.title}
                    </span>
                  </td>

                  {/* Restore */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRestore(note.id)}
                      title="Restore to My Notes"
                    >
                      <RotateCcw
                        size={16}
                        className="text-green-400 hover:text-green-500"
                      />
                    </button>
                  </td>

                  {/* Delete Forever */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteForever(note.id)}
                      title="Delete forever"
                    >
                      <Trash2
                        size={16}
                        className="text-red-400 hover:text-red-500"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {trashNoteList.map((note) => (
            <div
              key={note.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4"
            >
              <div className="text-xs text-gray-500 mb-1">
                {note.id}
              </div>

              <div className="text-gray-200 font-semibold mb-3">
                {note.title}
              </div>

              <div className="flex justify-between">
                <button onClick={() => handleRestore(note.id)}>
                  <RotateCcw size={18} className="text-green-400" />
                </button>

                <button onClick={() => handleDeleteForever(note.id)}>
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TrashPage;
