import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Eye, Download, Edit } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "../../utils/url";
import { toast } from "react-toastify";

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [mediaPreview, setMediaPreview] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingService, setPendingService] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingState, setPendingState] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [role, setRole] = useState("");

  const [allOrders, setAllOrders] = useState([])



  // NEW: Filter state
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const handleToggle = () => {
    setPendingState(!isEnabled);
    setOpen(true);
  };

  const confirmChange = () => {
    setIsEnabled(pendingState);
    setOpen(false);
  };

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}api/products/allProducts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setServices(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    fetchServices();
  }, []);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // get token from storage
        const res = await axios.get(`${BASE_URL}api/products/employee/orders`, {
          headers: {
            Authorization: `Bearer ${token}`, // attach token
          },
        });
        if (res.data.success) {
          setServices(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Open confirmation modal before updating
  const handleStatusClick = (service, status) => {
    setPendingService(service);
    setNewStatus(status);
    setConfirmOpen(true);
  };


  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token"); // get token from storage
      const res = await axios.get(`${BASE_URL}api/employee`, {
        headers: {
          Authorization: `Bearer ${token}`, // attach token
        },
      });

      console.log(res.data, "res")

      if (res.status === 200) {

        const employees = res?.data?.map((emp) => ({
          empId: emp?.employeeId,
          empName: emp?.fullName,
          id: emp?._id

        }));
        setEmployees(employees);
      }
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  };



  const confirmStatusUpdate = async () => {
    if (!pendingService) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}api/products/updateProduct/${pendingService._id}`,
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success(`Service ${newStatus ? "Enabled" : "Disabled"} ✅`);
        setServices((prev) =>
          prev.map((s) =>
            s._id === pendingService._id ? { ...s, isActive: newStatus } : s
          )
        );
      }
    } catch (err) {
      toast.error("❌ Failed to update status");
      console.error(err);
    } finally {
      setConfirmOpen(false);
      setPendingService(null);
      setNewStatus(null);
    }
  };

  // Filtered list
  const filteredServices = services?.filter((s) => {
      if (filter === "active") return s.isActive;
      if (filter === "inactive") return !s.isActive;
      return true;
    })
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Name", "Vendor ID", "Category", "email", "phone", "price", "createdAt", "Status"];
    const rows = services.map((s) => [
      s.productId,
      s.name,
      s.vendorId?.vendorId || "—",
      s.category || "",
      s.email || "",
      s.phone || "",
      s.price || 0,
      s.createdAt || 0,
      s.isActive ? "Active" : "Inactive",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "services.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssignOrder = async () => {
    if (!selectedEmployee || !selectedOrder) return;

    console.log(selectedOrder, "selectedOrder selectedOrder")
    try {
      const token = localStorage.getItem("token"); // get token from storage
      const res = await axios.put(
        `${BASE_URL}api/products/assign`,
        {
          orderId: selectedOrder._id, // make sure you're using `_id` from MongoDB
          employeeId: selectedEmployee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // attach token
          },
        }
      );

      console.log(res, "res")

      if (res.data.success) {
        toast.success("✅ Order assigned successfully!");
        // alert("Order assigned successfully!");
        setOpen(false);
        setSelectedEmployee("");
        // refresh orders
        setAllOrders((prev) =>
          prev.map((o) =>
            o._id === selectedOrder._id
              ? { ...o, assignedEmployee: res.data.employee }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Failed to assign order:", err);
    }
  };

  console.log(allOrders, "allOrders")

  useEffect(() => {
    if (services?.length > 0) {
      const totalServices = services?.length;
      const activeServices = services?.filter(s => s.isActive === true).length;
      const inactiveServices = services?.filter(s => s.isActive === false).length;

      localStorage.setItem("totalServices", totalServices);
      localStorage.setItem("active", activeServices);
      localStorage.setItem("inactive", inactiveServices);
    }
  }, [services]);


  useEffect(() => {
    const loginRole = localStorage.getItem("role");
    setRole(loginRole);
  })

  return (
    <div className="space-y-6 lg:mb-0 mb-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-gray-500">Manage all services</p>
        </div>
        {/* Export Button */}
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          onClick={() => setFilter("inactive")}
        >
          Inactive
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>View</TableHead>
                  {role !== "employee" ?
                    <TableHead>Action</TableHead>
                    : null}
                  {/* <TableHead>EMP ID</TableHead> */}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service?._id} className="hover:bg-muted/50">
                    <TableCell>{service?.productId}</TableCell>
                    <TableCell>{service?.vendorId?.vendorId}</TableCell>
                    <TableCell>{service?.name}</TableCell>
                    <TableCell>{service?.category}</TableCell>
                    <TableCell>{service?.email}</TableCell>
                    <TableCell>+91 {service?.phone}</TableCell>
                    <TableCell>₹{service?.price?.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      {service?.createdAt
                        ? new Date(service.createdAt)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedService(service);
                          setViewOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    {role === "employee" ? null : (
                      <TableCell>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(service);
                            setOpen(true);
                            fetchEmployees();
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}

                    {/* <TableCell>{service?.assignedEmployee?.employeeId}</TableCell> */}
                    <TableCell>
                      <button
                        onClick={() => handleStatusClick(service, !service.isActive)}
                        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${service.isActive ? "bg-green-800" : "bg-gray-300"
                          }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${service.isActive ? "translate-x-6" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Service Modal */}
      <>
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="lg:max-w-[60vw] max-w-[90vw]">
            <h3 className="font-semibold">{selectedService?.name}</h3>
             <p className="text:sm">Address :- {selectedService?.address}</p>
            <p className="text-gray-600">{selectedService?.description}</p>

            {selectedService?.images?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Images:</p>
                <div className="flex gap-3 flex-wrap">
                  {selectedService.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="service"
                      className="w-40 h-28 object-cover rounded-md border cursor-pointer"
                      onClick={() => setMediaPreview({ type: "image", src: img })}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedService?.videos?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Videos:</p>
                <div className="flex gap-3 flex-wrap">
                  {selectedService.videos.map((vid, idx) => (
                    <video
                      key={idx}
                      src={vid}
                      controls
                      className="w-60 h-40 rounded-md border cursor-pointer"
                      onClick={() => setMediaPreview({ type: "video", src: vid })}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>


        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>

              {selectedOrder?.assignedAt && (
                <div className="space-y-3 h-[fit-content] overflow-y-scroll">
                  {/* Order Info */}
                  <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Employee ID</p>
                      <p className="font-medium">{selectedOrder?.assignedEmployee?.employeeId}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Product ID</p>
                      <p className="font-medium">  {selectedOrder?.productId}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Employee Name</p>
                      <p className="font-medium">{selectedOrder?.assignedEmployee?.fullName}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Mobile</p>
                      <p className="font-medium">{selectedOrder?.assignedEmployee?.mobile}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-medium">{selectedOrder?.assignedEmployee?.email}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg col-span-1 sm:col-span-2 md:col-span-4">
                      <p className="text-gray-500 text-xs">Assigned At</p>
                      <p className="font-medium text-green-600">
                        {selectedOrder.assignedAt
                          ? new Date(selectedOrder.assignedAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "Not Assigned"}
                      </p>
                    </div>
                  </div>

                </div>
              )}
              <DialogTitle>Assign service</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <p>
                  <strong>Employees</strong>
                </p>

                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.empId} - {emp.empName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleAssignOrder} disabled={!selectedEmployee}>
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={!!mediaPreview} onOpenChange={() => setMediaPreview(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {mediaPreview?.type === "image" ? (
              <img
                src={mediaPreview?.src}
                alt="preview"
                className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
              />
            ) : (
              <video
                src={mediaPreview?.src}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to{" "}
            <span className="font-semibold">
              {newStatus ? "Enable" : "Disable"}
            </span>{" "}
            this service?
          </p>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate}>
              Yes, {newStatus ? "Enable" : "Disable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
