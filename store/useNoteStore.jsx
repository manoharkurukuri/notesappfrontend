import {axiosInstance} from "../utils/lib"
import {create} from "zustand"
import {toast} from "react-hot-toast"
import { arch } from "os"


export const useNoteStore = create((set,get)=>({
    notes:[],
    isLoadingNotes:false,
    isCreatingNote:false,

    createNote:async(data)=>{
        try {
            set({isCreatingNote:true})
            const response = await axiosInstance.post("/notes/create-note",data,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            set({notes:[...get().notes,response.data]})
            console.log(response.data);
            
            toast.success("Note created successfully")
            return "success"
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create note")
            return "error"
        }finally{
            set({isCreatingNote:false})
        }
    },

    fetchNotes:async()=>{
        try {
            set({isLoadingNotes:true})
            const response = await axiosInstance.get("/notes/get-notes",{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            set({notes:response.data})
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch notes")
        }finally{
            set({isLoadingNotes:false})
        }
    },
togglePin: async (noteId) => {
  try {
    const response = await axiosInstance.patch(
      `/notes/toggle-pin-note/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    console.log("Response Data:", response.data); // Debugging line

    const updatedNotes = get().notes.map(note =>
      note.id === noteId
        ? { ...note, ...response.data } // 👈 IMPORTANT
        : note
    );

    set({ notes: updatedNotes });

    toast.success("Note pin status toggled");
    return "success";
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to toggle pin");
    return "error";
  }
},
togglePublic: async (noteId) => {
  try {
    const response = await axiosInstance.patch(
      `/notes/toggle-public-note/${noteId}`,
      {},
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    const updatedNotes = get().notes.map(note =>
      note.id === noteId
        ? { ...note, ...response.data } // 👈 IMPORTANT
        : note
    );
    set({ notes: updatedNotes });

    toast.success("Note visibility toggled");
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to toggle visibility");
  }
},
toggleArchive: async (noteId) => {
  try {
    const response = await axiosInstance.patch(
      `/notes/toggle-archive-note/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    const updatedNote = response.data;

    // ✅ If note is archived → remove from notes list
    if (updatedNote.archived) {
      set({
        notes: get().notes.filter(note => note.id !== noteId),
      });
    } else {
      // Optional: if unarchived, update note in list
      set({
        notes: get().notes.map(note =>
          note.id === noteId ? updatedNote : note
        ),
      });
    }

    toast.success(
      updatedNote.archived
        ? "Note archived"
        : "Note unarchived"
    );
    return "success";
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to toggle archive");
    return "error";
  }
},
trashNote: async (noteId) => {
  try {
    const response = await axiosInstance.patch(
      `/notes/toggle-trash-note/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    const { trashed } = response.data;

    // If trashed -> remove from notes (Inbox)
    if (trashed) {
      set({
        notes: get().notes.filter(note => note.id !== noteId),
      });
      toast.success("Note moved to Trash");
    } else {
      toast.success("Note restored from Trash");
    }

    return "success";
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to trash note");
    return "error";
  }
},

fetchNoteById: async (noteId) => {
    try {
        const response = await axiosInstance.get(
            `/notes/get-note-by-id/${noteId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch note");
        return "You are not authorized to access this note"
    }
},
pinnedNotes:async()=>{
          try {
            const response = await axiosInstance.get("/notes/pinned-notes",{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            console.log(response.data);
            

            return response.data;


            
          } catch (error) {
            toast.error("Failed to fetch pinned notes")
            return null;
            
          }
},
archivedNotes:async()=>{
          try {
            const response = await axiosInstance.get("/notes/archive-notes",{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
          
            return response.data;
            
          }

          catch (error) {
            toast.error("Failed to fetch archived notes")
            return null;
          }
        },

        trashNotes:async()=>{
          try {
            const response = await axiosInstance.get("/notes/trash-notes",{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
           
            return response.data;
          }
          catch (error) {
            toast.error("Failed to fetch trash notes")
            return null;
          }
        },

        deleteForever:async(noteId)=>{
          try {
            await axiosInstance.delete(`/notes/delete-note/${noteId}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            toast.success("Note deleted permanently")
          }
          catch (error) {
            toast.error("Failed to delete note permanently")
          }
        },

        updateNote:async(noteId,updatedData)=>{
          try {
            const response = await axiosInstance.put(`/notes/update-note/${noteId}`,updatedData,{

                headers:{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            const updatedNote = response.data;
            set({ notes: get().notes.map(note =>
                note.id === noteId ? updatedNote : note
              ), });
            toast.success("Note updated successfully")
            return "success"
          } catch (error) {
            toast.error("Failed to update note")
            return "error"
          }
        },


}))
