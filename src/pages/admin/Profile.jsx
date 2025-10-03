import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Bell,
  Shield,
  Camera,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@isthri-wala.com",
    phone: "+91 98765 43210",
    address: "123 Business District, Mumbai, India",
    company: "Isthri Wala Services",
    bio: "Managing the Isthri Wala e-commerce platform with expertise in customer service and operations management.",
    timezone: "Asia/Kolkata",
    language: "English",
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPayments: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "1h",
    passwordExpiry: "90days",
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleNotificationUpdate = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSecurityUpdate = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6 lg:mb-0 mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-text-primary">Profile Settings</h1>
          <p className="text-admin-text-secondary">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2 bg-gradient-surface border-admin-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-admin-text-primary">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    AU
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-admin-text-primary">
                  {profileData.name}
                </h3>
                <p className="text-admin-text-secondary">{profileData.email}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="flex items-center gap-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-admin-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-admin-text-secondary" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-admin-text-secondary" />
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({ ...profileData, company: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-admin-text-secondary" />
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profileData.timezone} onValueChange={(value) =>
                  setProfileData({ ...profileData, timezone: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="Europe/London">London Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={profileData.language} onValueChange={(value) =>
                  setProfileData({ ...profileData, language: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleProfileUpdate} className="bg-gradient-primary border-0">
              <Save className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card className="bg-gradient-surface border-admin-border shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-admin-text-primary">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email for Orders</Label>
                  <p className="text-sm text-admin-text-secondary">
                    Get notified about new orders
                  </p>
                </div>
                <Switch
                  checked={notifications.emailOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailOrders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email for Payments</Label>
                  <p className="text-sm text-admin-text-secondary">
                    Payment confirmations
                  </p>
                </div>
                <Switch
                  checked={notifications.emailPayments}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailPayments: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-admin-text-secondary">
                    Critical alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, smsNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-admin-text-secondary">
                    Business performance reports
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
              <Button onClick={handleNotificationUpdate} variant="outline" className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gradient-surface border-admin-border shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-admin-text-primary">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-admin-text-secondary">
                    Add extra security to your account
                  </p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, twoFactor: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select value={security.sessionTimeout} onValueChange={(value) =>
                  setSecurity({ ...security, sessionTimeout: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="2h">2 hours</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Change Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button onClick={handleSecurityUpdate} variant="outline" className="w-full">
                Update Security
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}