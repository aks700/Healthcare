import React, { useContext, useState } from 'react';
import { assets } from "../assets/assets";
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
    const [state, setState] = useState("Admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAToken, backendUrl } = useContext(AdminContext);
    const { setDToken } = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (state === "Admin") {
                const { data } = await axios.post("/api/admin/login", {
                    email,
                    password
                })
                if (data.success) {
                    localStorage.setItem("aToken", data.token);
                    setAToken(data.token);
                    // console.log(data.token);
                } else {
                    toast.error(data.message);
                }
            } else {
                const {data}= await axios.post("/api/doctor/login",{email,password})
                 if (data.success) {
                    localStorage.setItem("dToken", data.token);
                    setDToken(data.token);
                    // console.log(data.token);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
            // console.log(error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
            <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-lg text-sm text-gray-700">
                <p className="text-lg font-semibold">
                    <span className="text-cyan-600">{state}</span> Login
                </p>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-gray-600">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email}
                        id="email"
                        type="email"
                        required
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-gray-600">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password}
                        id="password"
                        type="password"
                        required
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button

                    className="mt-4 w-full py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-all duration-200"
                >
                    Login
                </button>
                {
                    state === "Admin" ?
                        <p>Doctor Login? <span className='text-primary cursor-pointer' onClick={() => setState("Doctor")}>Click here </span></p>
                        : <p>Admin Login? <span className='text-primary cursor-pointer' onClick={() => setState("Admin")}>Click here </span></p>
                }
            </div>
        </form>
    );
};

export default Login;
