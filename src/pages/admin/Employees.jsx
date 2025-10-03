import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Search,
    UserPlus,
    Eye,
    Edit,
    Mail,
    Phone,
    MapPin,
    IdCard,
    Image as ImageIcon,
    Users as UsersIcon,
    Delete,
    DeleteIcon,
    Trash2,
} from "lucide-react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { BASE_URL } from "../../utils/url";
import { toast } from "react-toastify";

export default function Employees() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [editEmployee, setEditEmployee] = useState(null); // employee being edited
    const [formData, setFormData] = useState({}); // form state

    const getInitials = (name) =>
        name?.split(" ").map((w) => w[0]).join("").toUpperCase();

    const filteredEmployees = employees?.filter((emp) => {
        const matchesSearch =
            emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.mobile?.includes(searchTerm) ||
            emp.altMobile?.includes(searchTerm) ||
            emp.aadhar?.includes(searchTerm);
        return matchesSearch;
    });

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}api/employee`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) {
                setEmployees(res.data);
            }
        } catch (err) {
            console.error("Failed to load employees:", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle input changes in edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Open edit modal with prefilled data
    const handleEditClick = (emp) => {
        setEditEmployee(emp);
        setFormData({
            fullName: emp.fullName,
            email: emp.email,
            mobile: emp.mobile,
            altMobile: emp.altMobile || "",
            address: emp.address,
            password: emp.password
        });
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const res = await fetch(`${BASE_URL}api/employee/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT if required
                },
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                // remove employee from state
                setEmployees((prev) => prev.filter((emp) => emp._id !== id));
            } else {
                alert(data.message || "❌ Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("email", formData.email);
            data.append("mobile", formData.mobile);
            data.append("altMobile", formData.altMobile);
            data.append("address", formData.address);
            data.append("password", formData.password);

            if (formData.aadhaarFront) {
                data.append("aadhaarFront", formData.aadhaarFront);
            }
            if (formData.aadhaarBack) {
                data.append("aadhaarBack", formData.aadhaarBack);
            }

            const res = await axios.put(
                `${BASE_URL}api/employee/${editEmployee._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.status === 200) {
                setEditEmployee(null);
                toast.success("✅ Updated successfully!");
                // alert("updated successfully!")
                fetchEmployees(); // refresh list
            }
        } catch (err) {
            console.error("Error updating employee:", err);
        }
    };


    return (
        <div className="space-y-6 lg:mb-0 mb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-admin-text-primary flex items-center gap-2">
                        <UsersIcon className="h-7 w-7 text-primary" />
                        Employees
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage and view your employees
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-gradient-surface border-admin-border shadow-md">
                <CardContent className="p-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-admin-text-secondary" />
                        <Input
                            placeholder="Search employees by name, email, mobile, or Aadhar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Employees Table */}
            <Card className="bg-gradient-surface border-admin-border shadow-md">
                <CardHeader>
                    <CardTitle className="text-admin-text-primary">
                        Employee Database ({filteredEmployees?.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Aadhar</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Aadhaar Docs</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees?.map((emp) => (
                                    <TableRow key={emp._id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={emp?.avatar || ""} />
                                                    <AvatarFallback>
                                                        {getInitials(emp?.fullName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{emp?.fullName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        ID: {emp?.employeeId}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-gray-500" />
                                                    {emp.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-gray-500" />
                                                    {emp.mobile}
                                                </div>
                                                {emp.altMobile && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3 w-3 text-gray-500" />
                                                        {emp.altMobile}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <IdCard className="h-4 w-4 text-gray-500" />
                                                {emp.aadhar}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                {emp.address}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(emp.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}

                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <a
                                                    href={emp.aadhaarFront}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-sm flex items-center gap-1"
                                                >
                                                    <ImageIcon className="h-4 w-4" /> Front
                                                </a>
                                                <a
                                                    href={emp.aadhaarBack}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-sm flex items-center gap-1"
                                                >
                                                    <ImageIcon className="h-4 w-4" /> Back
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditClick(emp)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(emp?._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Employee Modal */}
            <Dialog open={!!editEmployee} onOpenChange={setEditEmployee}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 h-[70vh] overflow-y-scroll">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <Input
                                name="fullName"
                                value={formData.fullName || ""}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile
                            </label>
                            <Input
                                name="mobile"
                                value={formData.mobile || ""}
                                onChange={handleInputChange}
                                placeholder="Enter mobile number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alternate Mobile
                            </label>
                            <Input
                                name="altMobile"
                                value={formData.altMobile || ""}
                                onChange={handleInputChange}
                                placeholder="Enter alternate mobile number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <Input
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <Input
                                name="password"
                                value={formData.password || ""}
                                onChange={handleInputChange}
                                placeholder="Enter password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Aadhaar Front
                            </label>
                            <Input
                                type="file"
                                name="aadhaarFront"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, aadhaarFront: e.target.files[0] }))
                                }
                            />
                            {editEmployee?.aadhaarFront && (
                                <a
                                    href={editEmployee.aadhaarFront}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-xs"
                                >
                                    View current front image
                                </a>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Aadhaar Back
                            </label>
                            <Input
                                type="file"
                                name="aadhaarBack"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, aadhaarBack: e.target.files[0] }))
                                }
                            />
                            {editEmployee?.aadhaarBack && (
                                <a
                                    href={editEmployee.aadhaarBack}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-xs"
                                >
                                    View current back image
                                </a>
                            )}
                        </div>

                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditEmployee(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
