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

export default function Vendors() {
  const [allVendors, setAllVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        

        const res = await axios.get(
          "http://localhost:5000/api/vendor/getVendorDetails", // ✅ update backend API endpoint
         
        );

        console.log(res,"res res")

        setAllVendors(res.data || []);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // ✅ Filter vendors
  const filteredVendors = allVendors?.filter((vendor) => {
    return (
      vendor?.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor?.mobile?.includes(searchTerm) ||
      vendor?.vendorId?.toLowerCase()?.includes(searchTerm)
    );
  });

  // ✅ Export CSV
  const exportToCSV = () => {
    const headers = ["Vendor ID", "Name","Email", "Mobile", "Services"];
    const rows = filteredVendors.map((v) => [
      v._id,
      v.vendor_name,
      v.mobile,
      v.email,
      v.services?.join(", "),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "vendors.csv");
  };

  // ✅ Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredVendors.map((v) => ({
        "Vendor ID": v._id,
        Name: v.vendor_name,
        Mobile: v.mobile,
        email:v.email,
        Services: v?.services?.join(", "),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");
    XLSX.writeFile(workbook, "vendors.xlsx");
  };

  return (
    <div className="lg:p-6">
      <h1 className="text-2xl font-bold mb-6">{`Vendors (${filteredVendors?.length})`} </h1>

      {/* Search + Export */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <Input
          placeholder="Search by vendor ID, name, or mobile..."
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
                <TableHead>Vendor ID</TableHead>
                <TableHead>Name</TableHead>
                 <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>

                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length > 0 ? (
                filteredVendors?.map((vendor) => (
                  <TableRow key={vendor._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{vendor?.vendorId}</TableCell>
                    <TableCell>{vendor?.vendor_name}</TableCell>
                     <TableCell>{vendor?.email}</TableCell>
                    <TableCell>{vendor?.mobile}</TableCell>
                    {/* <TableCell>
                      {vendor?.services?.length
                        ? vendor.services.join(", ")
                        : "—"}
                    </TableCell> */}
                     <TableCell>
                      {vendor?.createdAt
                        ? new Date(vendor.createdAt).toLocaleDateString("en-GB") // 👈 en-GB gives dd/mm/yyyy
                          .replace(/\//g, "-") // replace slashes with dashes
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
                    No vendors found
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
