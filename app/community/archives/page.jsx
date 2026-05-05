"use client";

import React, { useEffect, useState } from "react";
import { ArchiveRestore, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { useNoteStore } from "../../../store/useNoteStore";

const ArchivePage = () => {
  const { archivedNotes, toggleArchive, trashNote } = useNoteStore();
  const [archives, setArchives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedNotes = async () => {
      const res = await archivedNotes();
      setArchives(res || []);
      setIsLoading(false);
    };
    fetchArchivedNotes();
  }, [archivedNotes]);

  const handleArchiveToggle = async (noteId) => {
    const result = await toggleArchive(noteId);
    if (result === "success") {
      setArchives((prevNotes) =>
        prevNotes.filter((note) => note.id !== noteId)
      );
    }
}

    const handleTrashNote = async (noteId) => {
      const result = await trashNote(noteId);
        if (result === "success") {
            setArchives((prevNotes) =>
            prevNotes.filter((note) => note.id !== noteId)
            );
        }
    }
    

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-300">
        Loading archived notes...
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-100 mb-4">
          Archived Notes
        </h1>

        {/* Desktop Table */}
        <div className="hidden md:block bg-slate-900 rounded-lg border border-slate-800 shadow">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-slate-800 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Unarchive</th>
                <th className="px-4 py-3 text-center">Trash</th>
                <th className="px-4 py-3 text-center">Open</th>
              </tr>
            </thead>

            <tbody>
              {archives.length === 0 && (
                <tr key="no-archives">
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500"
                  >
                    No archived notes
                  </td>
                </tr>
              )}

              {archives.map((note) => (
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

                  {/* Unarchive */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleArchiveToggle(note.id)}
                      title="Unarchive"
                    >
                      <ArchiveRestore
                        size={16}
                        className="text-yellow-400 hover:text-yellow-500"
                      />
                    </button>
                  </td>

                  {/* Trash */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleTrashNote(note.id)}
                      title="Move to Trash"
                    >
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
          {archives.map((note) => (
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
                <button onClick={() => handleArchiveToggle(note.id)}>
                  <ArchiveRestore size={18} className="text-yellow-400" />
                </button>

                <button onClick={() => handleTrashNote(note.id)}>
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

export default ArchivePage;
