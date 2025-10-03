import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../utils/url";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allPayments, setAllPayments] = useState([])

  const payments = [
    {
      id: "PAY-001",
      orderId: "ORD-001",
      customer: "Rajesh Kumar",
      amount: "₹150",
      method: "UPI",
      status: "completed",
      date: "2024-01-15",
      time: "14:30",
      transactionId: "TXN789123456",
    },
    {
      id: "PAY-002",
      orderId: "ORD-002",
      customer: "Priya Sharma",
      amount: "₹450",
      method: "Credit Card",
      status: "pending",
      date: "2024-01-14",
      time: "16:45",
      transactionId: "TXN789123457",
    },
    {
      id: "PAY-003",
      orderId: "ORD-003",
      customer: "Amit Singh",
      amount: "₹200",
      method: "Cash",
      status: "completed",
      date: "2024-01-13",
      time: "11:20",
      transactionId: "CASH001",
    },
    {
      id: "PAY-004",
      orderId: "ORD-004",
      customer: "Sunita Devi",
      amount: "₹180",
      method: "UPI",
      status: "completed",
      date: "2024-01-12",
      time: "09:15",
      transactionId: "TXN789123458",
    },
    {
      id: "PAY-005",
      orderId: "ORD-005",
      customer: "Mohammad Ali",
      amount: "₹120",
      method: "Debit Card",
      status: "failed",
      date: "2024-01-11",
      time: "13:30",
      transactionId: "TXN789123459",
    },
  ];



  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "UPI":
        return "bg-success/10 text-success";
      case "Credit Card":
        return "bg-primary/10 text-primary";
      case "Debit Card":
        return "bg-warning/10 text-warning";
      case "Cash":
        return "bg-muted text-admin-text-secondary";
      default:
        return "bg-muted text-admin-text-secondary";
    }
  };


  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/orders/getAllOrders`, {
          // headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.orders;
        console.log(data, "data");

  
        if (res.data.success) {
          const payments = data.map((order) => ({
            id: order?.id ? order.id.replace("ORD", "PAY") : "PAY-000",
            orderId: order?.id || "ORD-000",
            customer: order?.customer || "N/A",
            amount: order?.amount || "₹0",
            method: order?.method || order?.paymentMethod || "RAZORPAY",
            status: order?.status || "pending",
            date: order?.date || "N/A",
            time: order?.date
              ? new Date(order.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "00:00",
            transactionId: order?.paymentId || "N/A",
          }));

          setAllPayments(payments); // set array, not single object
        }

      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const filteredPayments = allPayments.filter((payment) => {
    const matchesSearch =
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  console.log(allPayments, "allPayments")

  return (
    <div className="space-y-6 lg:mb-0 mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-text-primary">Payments</h1>
          <p className="text-admin-text-secondary">
            Track and manage all payment transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Payment Stats */}
    

      {/* Filters */}
      <Card className="bg-gradient-surface border-admin-border shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-admin-text-secondary" />
              <Input
                placeholder="Search payments, service, or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-gradient-surface border-admin-border shadow-md">
        <CardHeader>
          <CardTitle className="text-admin-text-primary">
            Payment Transactions ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/5">
                    <TableCell className="  font-medium">{payment.id}</TableCell>
                    <TableCell >
                      <span className=" rounded-md text-sm w-[fit-content] ">
                        {payment.orderId}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-admin-text-primary">
                      {payment.customer}
                    </TableCell>
                    <TableCell className="font-semibold text-lg">
                      {payment.amount}
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-sm ${getMethodColor(payment.method)}`}>
                        {payment.method}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-admin-text-secondary">
                        <p>{payment.date}</p>
                        {/* <p className="text-xs">{payment.time}</p> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {payment.transactionId}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}