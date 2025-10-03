import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { BASE_URL } from "../../utils/url";
import { toast } from "react-toastify";


export default function AddEmployeeForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    // Watch for file inputs
    const aadhaarFront = watch("aadhaarFront");
    const aadhaarBack = watch("aadhaarBack");

    // Loader state
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        console.log("✅ Form submitted with data:", data);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("mobile", data.mobile);
            formData.append("altMobile", data.altMobile || "");
            formData.append("address", data.address);
            formData.append("aadhar", data.aadhar);
            formData.append("password", data.password);

            if (data.aadhaarFront?.[0]) {
                formData.append("aadhaarFront", data.aadhaarFront[0]);
            }
            if (data.aadhaarBack?.[0]) {
                formData.append("aadhaarBack", data.aadhaarBack[0]);
            }

            const response = await axios.post(
                `${BASE_URL}api/employee/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(response, "response");

            toast.success("✅ Employee added successfully!");

            // alert("✅ Employee added successfully!");
            reset();
        } catch (error) {
            console.error(
                "❌ Error adding employee:",
                error.response?.data || error.message
            );
            toast.error(
                "❌  Something went wrong!. Try again."
            );

            // alert(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Loader Overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 rounded-2xl">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    ➕ Add New Employee
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Full Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("fullName", { required: "Full Name is required" })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter full name"
                            />
                            {errors.fullName && (
                                <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter email"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Mobile + Alternate Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("mobile", {
                                    required: "Mobile is required",
                                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
                                })}
                                maxLength={10}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter mobile number"
                            />
                            {errors.mobile && (
                                <p className="text-red-600 text-sm">{errors.mobile.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Alternate Mobile
                            </label>
                            <input
                                type="text"
                                {...register("altMobile", {
                                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
                                })}
                                maxLength={10}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter alternate mobile"
                            />
                            {errors.altMobile && (
                                <p className="text-red-600 text-sm">{errors.altMobile.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("address", { required: "Address is required" })}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Enter address"
                        />
                        {errors.address && (
                            <p className="text-red-600 text-sm">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Aadhaar Number + Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Aadhaar Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("aadhar", {
                                    required: "Aadhaar is required",
                                    pattern: { value: /^[0-9]{12}$/, message: "Must be 12 digits" },
                                })}
                                maxLength={12}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter Aadhaar number"
                            />
                            {errors.aadhar && (
                                <p className="text-red-600 text-sm">{errors.aadhar.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("password", { required: "Password is required" })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter password"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Aadhaar Front & Back Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Aadhaar Front <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("aadhaarFront", { required: "Front image is required" })}
                                className="mt-1 w-full"
                            />
                            {aadhaarFront?.[0] && (
                                <img
                                    src={URL.createObjectURL(aadhaarFront[0])}
                                    alt="Aadhaar Front Preview"
                                    className="mt-2 h-32 rounded-lg border shadow"
                                />
                            )}
                            {errors.aadhaarFront && (
                                <p className="text-red-600 text-sm">{errors.aadhaarFront.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Aadhaar Back <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("aadhaarBack", { required: "Back image is required" })}
                                className="mt-1 w-full"
                            />
                            {aadhaarBack?.[0] && (
                                <img
                                    src={URL.createObjectURL(aadhaarBack[0])}
                                    alt="Aadhaar Back Preview"
                                    className="mt-2 h-32 rounded-lg border shadow"
                                />
                            )}
                            {errors.aadhaarBack && (
                                <p className="text-red-600 text-sm">{errors.aadhaarBack.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-70"
                    >
                        {loading ? "Adding Employee..." : "Add Employee"}
                    </button>
                </form>
            </div>
        </div>
    );
}
