import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import React, { useState } from 'react';
import toast from "react-hot-toast";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../../Images/HD GST LOGO.png";
import '../../index.css';
import { baseUrl } from "../../utils/config";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/v1/user/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                const { accessToken } = response.data.data.user;
                localStorage.setItem("accessToken", accessToken);
                
                const userData = response.data.data;
                localStorage.setItem("userdata", JSON.stringify(userData));
                
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                toast.success("Login successful!");
                
                await new Promise(resolve => setTimeout(resolve, 100));
                navigate("/Home");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    // Check for remembered email on component mount
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Left side - Logo and branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-green-600 flex-col justify-center items-center p-12">
                <div className="max-w-md text-center">
                    <img
                        src={logo}
                        alt="GST logo"
                        className="w-full max-w-[220px] h-auto mx-auto mb-8 object-contain"
                    />
                    <h1 className="text-4xl font-bold text-white mb-6">Queue Management System</h1>
                    <p className="text-green-100 text-lg">
                        Streamline patient flow, reduce waiting times, and enhance the overall 
                        healthcare experience with our integrated queue management solution.
                    </p>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
                <div className="w-full max-w-md">
                    {/* Logo shown only on mobile */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <img
                            src={logo}
                            alt="GST logo"
                            className="w-24 h-auto object-contain"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <FaUserCircle className="text-green-600 text-3xl" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 text-center mb-8">
                            Please sign in to access your account
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            className="text-sm text-green-600 hover:text-green-800 transition-colors duration-200"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors duration-200"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
                            >
                                {loading ? (
                                    <Spinner size="sm" color="white" className="mr-2" />
                                ) : null}
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        © {new Date().getFullYear()} Queue Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
