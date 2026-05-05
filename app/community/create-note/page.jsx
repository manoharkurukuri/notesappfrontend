"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../../../utils/lib";
import { Pin, Save, ArrowLeft } from "lucide-react";
import { useNoteStore } from "../../../store/useNoteStore";
import toast from "react-hot-toast";

const COLORS = [
  { name: "yellow", class: "bg-yellow-100" },
  { name: "green", class: "bg-green-100" },
  { name: "blue", class: "bg-blue-100" },
  { name: "red", class: "bg-red-100" },
  { name: "gray", class: "bg-gray-100" }
];



export default function CreateNotePage() {
  const router = useRouter();
  const { createNote,isCreatingNote } = useNoteStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState("yellow");
  const [isPinned, setIsPinned] = useState(false);

  // ➕ Add tag
  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // ❌ Remove tag
  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  // 💾 Save note
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
       const res = await createNote({
        title,
        content,
        tags,
        color,
        isPinned
      });
      if(res==="success")
        router.push("/community/my-notes");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save note");
    }
    
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 ${
        COLORS.find(c => c.name === color)?.class
      }`}
    >
      {/* 🔝 Top Bar */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 rounded-full border transition ${
              isPinned
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <Pin size={16} />
          </button>

          <button
            onClick={saveNote}
            disabled={isCreatingNote}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {isCreatingNote ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* 📝 Note Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 space-y-5">
        
        {/* 🏷 Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full
            text-2xl
            font-semibold
            text-gray-900
            placeholder-gray-500
            bg-gray-50
            px-3
            py-2
            rounded-md
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        {/* 📝 Content */}
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="
            w-full
            min-h-[220px]
            resize-none
            text-gray-900
            placeholder-gray-500
            bg-gray-50
            px-3
            py-2
            rounded-md
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        {/* 🏷 Tags */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="
                  flex
                  items-center
                  gap-1
                  px-3
                  py-1
                  bg-black
                  text-white
                  rounded-full
                  text-xs
                "
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-300"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Add tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="
              w-full
              text-sm
              text-gray-900
              placeholder-gray-500
              bg-gray-50
              px-3
              py-2
              rounded-md
              outline-none
              focus:ring-2
              focus:ring-black
            "
          />
        </div>

        {/* 🎨 Color Picker */}
        <div className="flex gap-3">
          {COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              className={`
                w-7 h-7
                rounded-full
                border
                transition
                hover:scale-110
                ${color === c.name ? "ring-2 ring-black" : ""}
                ${c.class}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
