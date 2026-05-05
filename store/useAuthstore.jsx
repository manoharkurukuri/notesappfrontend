import {axiosInstance} from "../utils/lib"
import {create} from "zustand"
import {toast} from "react-hot-toast"

export const useAuthstore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isCheckingAuth:true,
    isAuthenticated:false,
    isUpdatingProfile:false,

    register:async(data)=>{
        try {

            set({isSigningUp:true})
            const response = await axiosInstance.post("/auth/create-user",data)
            toast.success("Registration successful")
            return "success"
            
        } catch (error) {
            toast.error(error.response?.data?.error || "Registration failed")
            return "error"

            
        }finally{
            set({isSigningUp:false})
        }
    },
    login:async(data)=>{
        try {
            set({isLoggingIn:true})
            const response = await axiosInstance.post("/auth/login-user",data)
            localStorage.setItem("authToken",response.data.token)
            set({authUser:response.data.user,isAuthenticated:true})
            toast.success("Login successful")
            return "success"
            
        } catch (error) {
            toast.error(error.response?.data?.error || "Login failed")
            return "error"
        }finally{
            set({isLoggingIn:false})
        }
        },
        checkAuth:async()=>{
            try {
                set({isCheckingAuth:true})
                const token = localStorage.getItem("authToken")
                if(!token){
                    set({isAuthenticated:false,authUser:null})
                    return
                }
                const response = await axiosInstance.get("/auth/check-auth",{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                set({authUser:response.data,isAuthenticated:true})
            } catch (error) {
                set({isAuthenticated:false,authUser:null})
            }finally{
                set({isCheckingAuth:false})
            }
        },
        logout:()=>{
            localStorage.removeItem("authToken")
            set({authUser:null,isAuthenticated:false})
            toast.success("Logged out successfully")
        },

    update:async(data)=>{
    set({ isUpdatingProfile: true });
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.put(`auth/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ authUser: response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  }

    
}));