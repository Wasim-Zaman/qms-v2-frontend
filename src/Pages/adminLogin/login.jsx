import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../index.css';
import { baseUrl } from "../../utils/config";
import Spinner from '../../components/spinner/spinner';
import toast from "react-hot-toast";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [loading, setLoading] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

   const handleSubmit = async () => {
     setLoading(true);
     const email = document.querySelector('input[type="email"]').value;
     const password = document.querySelector('input[type="password"]').value;

     try {
       const response = await axios.post(`${baseUrl}/api/v1/user/login`, {
         email,
         password,
       });

       if (response.status === 200) {
         const { accessToken } = response.data.data.user;
         localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userdata", JSON.stringify(response?.data?.data));

         toast.success("Successfully logged in!");
         navigate("/patient-table");
       }
     } catch (error) {
        toast.error(error?.response?.data?.message || "Not Login");
     } finally {
       setLoading(false);
     }
   };

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        {loading && <Spinner />}
        <form
          className="bg-white shadow-md rounded-lg p-8 space-y-6 max-w-sm w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Login
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your email below to login to your account
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-3 w-full border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring focus:ring-green-300 outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring focus:ring-green-300 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="text-sm text-gray-500">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium text-sm transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    );
};

export default Login;
