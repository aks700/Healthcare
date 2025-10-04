import { createContext } from "react"
import React, { useState } from 'react'
import axios from "axios"
import {toast} from "react-toastify"


export  const AdminContext = createContext()

export const AdminContextProvider = ( props ) => {
    const [aToken, setAToken] = useState(localStorage.getItem("aToken")? localStorage.getItem("aToken") : "")
    const [doctors,setDoctors]=useState([])
    const [appointments,setAppointments]=useState([])
    const [dashData,setDashData]=useState(false)


    const getAllDoctors=async()=>{
        try {
            const {data}= await axios.post("/api/admin/all-doctors",{},{headers: { Authorization: `Bearer ${aToken}` }}) 
            if (data.success) {
                setDoctors(data.doctors)
                // console.log(data.doctors)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

            
        }
    }

    const changeAvailability=async (docId)=>{
        try {
                const {data}=await axios.post("/api/admin/change-availablity",{docId},{headers: { Authorization: `Bearer ${aToken}` }})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }else{
                    toast.error(error.message)
            }
        } catch (error) {
            toast.error(error.message) 
        }
    }

    const getAllAppointments = async ()=>{
        try {
            const {data}= await axios.get("/api/admin/appointments",{headers: { Authorization: `Bearer ${aToken}` }})
            if(data.success){
                setAppointments(data.appointments)
                // console.log(data.appointments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message) 
        }
    }

    const cancelAppointment = async (appointmentId)=>{
        try {
            const {data}=await axios.post("/api/admin/cancel-appointment",{appointmentId},{headers: { Authorization: `Bearer ${aToken}` }})
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }

    const getDashData = async ()=>{
        try {
            const {data}=await axios.get("/api/admin/dashboard",{headers: { Authorization: `Bearer ${aToken}` }})
            if(data.success){
                setDashData(data.dashData)
                // console.log(data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
            
        }
    }

    const value = {
        // Define any state or functions you want to provide to the context
        aToken,
        setAToken, 
        doctors,getAllDoctors,changeAvailability,
        appointments, setAppointments,getAllAppointments,
        cancelAppointment,
        dashData, getDashData
    };
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>  
    )

}

// export default AdminContextProvider;  