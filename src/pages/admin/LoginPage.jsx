import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/url";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [role, setRole] = useState("admin");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}api/${role}/login`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // ✅ Success
            toast.success(`✅ Logged in successfully as ${role}`);
            console.log("Login Success:", response.data);

            // Save JWT token
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("name", response?.data?.employee?.fullName || "")

            // Redirect
            if (role === "admin") {
                window.location.href = "/dashboard";
                // navigate("/dashboard")
            } else {
                window.location.href = "/dashboard";
                // navigate("/dashboard")
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "❌ Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-400 to-blue-400 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold text-gray-800">
                            {role === "admin" ? "Admin Login" : "Employee Login"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Role Switch Tabs */}
                        <div className="flex justify-center mb-6 gap-4">
                            <Button
                                onClick={() => setRole("admin")}
                                variant={role === "admin" ? "default" : "outline"}
                                className="rounded-md"
                            >
                                Admin
                            </Button>
                            <Button
                                onClick={() => setRole("employee")}
                                variant={role === "employee" ? "default" : "outline"}
                                className="rounded-md"
                            >
                                Employee
                            </Button>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 text-lg rounded-xl"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>

                        {/* Extra Links */}
                        {/* <div className="text-center mt-4 text-sm text-gray-600">
                            <a href="#" className="hover:underline">
                                Forgot password?
                            </a>
                        </div> */}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
