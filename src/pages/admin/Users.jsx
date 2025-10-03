import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/user/getUserDetails",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Filter users
  const filteredUsers = allUsers.filter((user) => {
    return (
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm)
    );
  });

  // ✅ Export CSV
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Mobile", "Created Date"];
    const rows = filteredUsers.map((u) => [
      u.userName,
      u.email,
      u.mobile,
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "users.csv");
  };

  // ✅ Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((u) => ({
        Name: u.userName,
        Email: u.email,
        Mobile: u.mobile,
        "Created Date": u.createdAt
          ? new Date(u.createdAt).toLocaleDateString()
          : "",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  return (
    <div className="lg:p-6">
      <h1 className="text-2xl font-bold mb-6">{`Users (${filteredUsers?.length})`}</h1>

      {/* Search + Export */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <Input
          placeholder="Search by name, email, or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />

        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            Export CSV
          </Button>
          <Button onClick={exportToExcel}>Export Excel</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
