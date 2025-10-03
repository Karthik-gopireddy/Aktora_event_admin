import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/url";

export default function Dashboard() {

  const [ordersData, setordersData] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [role, setRole] = useState("");
  const [name, setName] = useState("")

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedname = localStorage.getItem("name");
    setRole(storedRole);
    setName(storedname);
  }, []);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && role === "employee") return;

    const fetchOrders = async () => {
      try {
        // const token = localStorage.getItem("token");

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const url =
          role === "employee"
            ? `${BASE_URL}api/products/employee/orders`
            : `${BASE_URL}api/products/allProducts`;

        const res = await axios.get(url, { headers });

        console.log(res, "res")

        if (res.data) {

          setordersData(res.data.orders);
          setAllEvents(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchOrders();
  }, [role]);


  // useEffect(() => {
  //   if (ordersData?.length > 0) {
  //     const totalServices = ordersData?.length || 0;
  //     const activeServices = ordersData?.filter(s => s.isActive === true).length || 0;
  //     const inactiveServices = ordersData?.filter(s => s.isActive === false).length || 0;

  //     localStorage.setItem("totalServices", totalServices);
  //     localStorage.setItem("active", activeServices);
  //     localStorage.setItem("inactive", inactiveServices);
  //   }
  // }, [ordersData]);


  const totalRevenue = ordersData.reduce((sum, item) => {
    return sum + Number(item.amount?.toString().replace(/[₹,]/g, "") || 0);
  }, 0);

  // const totalServices = localStorage.getItem("totalServices");
  // const activeServices = localStorage.getItem("active");
  // const inactiveServices = localStorage.getItem("inactive");






  // useEffect(() => {

  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get(`${BASE_URL}api/user/getAllUsersWithOrders`, {

  //       });

  //       if (res.data.success) {
  //         setAllUsers(res.data.users);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load orders:", err);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(`${BASE_URL}api/products/allProducts`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (res.status === 200) {
  //         setAllEvents(res.data);

  //       }
  //     } catch (err) {
  //       console.error("Failed to load services:", err);
  //     }
  //   };
  //   fetchServices();
  // }, []);





  const totalServices = ordersData.length;
  const activeServices = ordersData.filter(s => s.isActive).length;
  const inactiveServices = ordersData.filter(s => !s.isActive).length;



  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      trend: "up",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Active Services",
      value: activeServices,
      trend: "up",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "InActive Services",
      value: inactiveServices,
      trend: "up",
      icon: Package,
      color: "text-primary",
    },
  ];





  console.log(ordersData, "ordersData")


  return (
    <div className="space-y-6 lg:mb-0 mb-10">
      <div className="flex items-center justify-between">
        <div>

          {role === "employee" ? (
            <h1 className="text-3xl font-bold text-admin-text-primary">
              Hello {name?.charAt(0)?.toUpperCase() + name?.slice(1)}, {" "}
              Welcome to Dashboard!
            </h1>

          ) : (
            <h1 className="text-3xl font-bold text-admin-text-primary">
              Welcome to Dashboard!
            </h1>

          )}

          {/* <p className="text-admin-text-secondary">
            Welcome to your ISTRIWALA admin panel
          </p> */}
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-gradient-surface border-admin-border shadow-md hover:shadow-lg transition-all duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-admin-text-secondary">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-admin-text-primary">
                    {stat.value}
                  </p>

                </div>
                <div
                  className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-gradient-surface border-admin-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-admin-text-primary">Recent Services</span>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allEvents?.slice(0, 4)?.map((order) => (
                <div
                  key={order?._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-admin-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${order?.isActive === true
                        ? "bg-success/10 text-success"
                        : order?.isActive === false
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-admin-text-secondary"
                        }`}
                    >
                      {order?.isActive === true ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-admin-text-primary">
                        {order.name}
                      </p>
                      <p className="text-sm text-admin-text-secondary">

                        ID: {order?.productId}
                      </p>
                      <p className="text-sm text-admin-text-secondary">

                        ₹{order?.price?.toLocaleString("en-IN")}
                      </p>
                      {/* <p className="text-xs text-admin-text-secondary">
                        {order.time}
                      </p> */}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-admin-text-primary">
                      Category: {order?.category}
                    </p>
                    <p className="font-semibold text-admin-text-primary">
                      Date: {order?.createdAt
                        ? new Date(order.createdAt)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")
                        : "—"}
                    </p>

                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {/* <Card className="bg-gradient-surface border-admin-border shadow-md">
          <CardHeader>
            <CardTitle className="text-admin-text-primary">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-primary border-0">
              <Package className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}