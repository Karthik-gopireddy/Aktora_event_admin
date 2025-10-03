import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

export function AdminSidebar() {
  const { state } = useSidebar();


  const collapsed = state === "collapsed";
const [role, setRole] = useState("");
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "admin");
  }, []);

  // base menu items
  let menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Services",
      url: "/services",
      icon: Package,
    },
    // {
    //   title: "Profile Settings",
    //   url: "/profile",
    //   icon: Settings,
    // },
  ];

  // add extra items only if NOT employee
  if (role !== "employee") {
    menuItems = [
      ...menuItems,
      {
        title: "Payments",
        url: "/payments",
        icon: CreditCard,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Employees",
        url: "/employees",
        icon: Users,
      },
    ];
  }

  return (
    <Sidebar className="border-r border-admin-border bg-admin-surface">
      <SidebarContent>
        <div className="p-6 border-b border-admin-border">
          <div className="flex items-center gap-3">
            <img src="/Aktora_Logo-1.png" alt="logo" className="h-10 w-10" />
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-admin-text-primary">
                  AKTORA EVENTS
                </h2>
                <p className="text-xs text-admin-text-secondary">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-black shadow-md"
                            : "text-admin-text-secondary hover:bg-muted hover:text-admin-text-primary"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
