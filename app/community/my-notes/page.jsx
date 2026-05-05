"use client";

import React, { useEffect } from "react";
import {
  Pin,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { useNoteStore } from "../../../store/useNoteStore";
import { useAuthstore } from "../../../store/useAuthstore";
import Link from "next/link";

const NotesPage = () => {
  const {
    fetchNotes,
    notes,
    isLoadingNotes,
    togglePin,
    togglePublic,
    toggleArchive,
    trashNote,
  } = useNoteStore();

  const { isCheckingAuth } = useAuthstore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /* ---------------- STATES ---------------- */

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-300">
        Checking authentication...
      </div>
    );
  }

  if (isLoadingNotes) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-300">
        Loading notes...
      </div>
    );
  }

  /* ---------------- ACTION HANDLERS ---------------- */

  const handlePin = (note) => togglePin(note.id);
  const handleArchive = (note) => toggleArchive(note.id);
  const handleTrash = (note) => trashNote(note.id);
  const handleVisibility = (note) => togglePublic(note.id);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-100 mb-4">
          My Notes
        </h1>

        {/* Desktop Table */}
        <div className="hidden md:block bg-slate-900 rounded-lg border border-slate-800 shadow">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-slate-800 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Pin</th>
                <th className="px-4 py-3 text-center">Public</th>
                <th className="px-4 py-3 text-center">Archive</th>
                <th className="px-4 py-3 text-center">Trash</th>
                <th className="px-4 py-3 text-center">Open</th>
              </tr>
            </thead>

            <tbody>
              {notes?.length === 0 && (
                <tr key="no-notes">
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500"
                  >
                    No notes found
                  </td>
                </tr>
              )}

              {notes?.map((note) => (
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

                  {/* Pin */}
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handlePin(note)}>
                      <Pin
                        size={16}
                        className={
                          note.pinned
                            ? "text-yellow-400"
                            : "text-gray-500 hover:text-gray-300"
                        }
                      />
                    </button>
                  </td>

                  {/* Visibility */}
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleVisibility(note)}>
                      {note.public ? (
                        <Eye size={16} className="text-green-400" />
                      ) : (
                        <EyeOff
                          size={16}
                          className="text-gray-500 hover:text-gray-300"
                        />
                      )}
                    </button>
                  </td>

                  {/* Archive */}
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleArchive(note)}>
                      <Archive
                        size={16}
                        className="text-gray-500 hover:text-gray-300"
                      />
                    </button>
                  </td>

                  {/* Trash */}
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleTrash(note)}>
                      <Trash2
                        size={16}
                        className="text-red-400 hover:text-red-500"
                      />
                    </button>
                  </td>

                  {/* Open */}
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/community/my-notes/${note.id}`}
                      className="
                        px-3
                        py-1
                        text-xs
                        font-medium
                        rounded
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        transition
                      "
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {notes?.map((note) => (
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

              <div className="flex justify-between items-center">
                <button onClick={() => handlePin(note)}>
                  <Pin
                    size={18}
                    className={
                      note.pinned
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }
                  />
                </button>

                <button onClick={() => handleVisibility(note)}>
                  {note.public ? (
                    <Eye size={18} className="text-green-400" />
                  ) : (
                    <EyeOff size={18} className="text-gray-400" />
                  )}
                </button>

                <button onClick={() => handleArchive(note)}>
                  <Archive size={18} className="text-gray-400" />
                </button>

                <button onClick={() => handleTrash(note)}>
                  <Trash2 size={18} className="text-red-400" />
                </button>

                <Link
                  href={`/community/my-notes/${note.id}`}
                  className="
                    text-xs
                    px-3
                    py-1
                    bg-blue-600
                    text-white
                    rounded
                    hover:bg-blue-700
                  "
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NotesPage;
