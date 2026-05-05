"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  Pin,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Check,
} from "lucide-react";
import { useNoteStore } from "../../../../store/useNoteStore";
import { useAuthstore } from "../../../../store/useAuthstore";

/* ---------------- COLOR CONFIG ---------------- */

const COLOR_CONFIG = {
  yellow: { pageBg: "bg-yellow-900/20", dot: "bg-yellow-400" },
  green: { pageBg: "bg-green-900/20", dot: "bg-green-400" },
  blue: { pageBg: "bg-blue-900/20", dot: "bg-blue-400" },
  red: { pageBg: "bg-red-900/20", dot: "bg-red-400" },
  gray: { pageBg: "bg-gray-800/40", dot: "bg-gray-400" },
};

const NotePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    fetchNoteById,
    updateNote,
    togglePin,
    togglePublic,
    toggleArchive,
    trashNote,
  } = useNoteStore();

  const { authUser } = useAuthstore();

  const [note, setNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const saveTimer = useRef(null);

  /* ---------------- FETCH NOTE (ALWAYS RUNS) ---------------- */

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      try{
      const data = await fetchNoteById(id);
      setNote(data);
      }catch(err){
        console.log(err);
        
        setError(true);
      }finally{
        setLoading(false);
      }
    };
    loadNote();
  }, [id, fetchNoteById]);

  /* ---------------- OWNERSHIP (SAFE) ---------------- */

  const isOwner = authUser?.id && note?.ownerId
    ? authUser.id === note.ownerId
    : false;

  /* ---------------- AUTO SAVE (ALWAYS DECLARED) ---------------- */

  useEffect(() => {
    if (!autoSave || !note || !isOwner) return;

    clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      setIsSaving(true);
      await updateNote(note.id, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        color: note.color,
      });
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(saveTimer.current);
  }, [note, autoSave, isOwner, updateNote]);

  /* ---------------- LOADING UI (AFTER HOOKS) ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-300">
        Loading note...
      </div>
    );
  }
  if (authUser?.id!==note?.ownerId && note==="You are not authorized to access this note") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500">
        You are not authorized to access this note.
      </div>
    );
  }

  /* ---------------- HANDLERS ---------------- */

  const handleSave = async () => {
    if (!isOwner) return;
    setIsSaving(true);
    await updateNote(note.id, {
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
    });
    setIsSaving(false);
  };

  const addTag = (e) => {
    if (!isOwner) return;
    if (e.key === "Enter" && tagInput.trim()) {
      setNote({
        ...note,
        tags: [...(note.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    if (!isOwner) return;
    setNote({
      ...note,
      tags: note.tags.filter((t) => t !== tag),
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      <div
        className={`absolute inset-0 ${
          COLOR_CONFIG[note?.color]?.pageBg || ""
        }`}
      />

      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={autoSave}
                  disabled={!isOwner}
                  onChange={() => setAutoSave(!autoSave)}
                />
                Auto-save
              </label>

              {!autoSave && isOwner && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={isSaving}
                >
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              )}

              {!isOwner && (
                <span className="text-sm text-gray-400">Read-only</span>
              )}

              {autoSave && isSaving && (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <Check size={14} /> Saving
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <input
            value={note?.title}
            disabled={!isOwner}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className={`w-full bg-slate-900 border border-slate-800 rounded
              px-4 py-3 text-2xl font-semibold text-gray-100 mb-4
              ${!isOwner ? "opacity-70 cursor-not-allowed" : ""}`}
          />

          {/* Content */}
          <textarea
            value={note?.content}
            disabled={!isOwner}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            rows={12}
            className={`w-full bg-slate-900 border border-slate-800 rounded
              px-4 py-3 text-gray-200 resize-none mb-4
              ${!isOwner ? "opacity-70 cursor-not-allowed" : ""}`}
          />

          {/* Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {(note?.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800 text-gray-200 rounded-full text-xs"
                >
                  #{tag}
                  {isOwner && (
                    <button
                      className="ml-2 text-red-400"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            <input
              value={tagInput}
              disabled={!isOwner}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tag and press Enter"
              className={`w-full bg-slate-900 border border-slate-800 rounded
                px-3 py-2 text-sm text-gray-300
                ${!isOwner ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotePage;
