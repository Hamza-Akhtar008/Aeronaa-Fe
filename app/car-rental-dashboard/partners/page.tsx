"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, BadgeCheck, AlertCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with real data from your API
const partners = [
  {
    id: "P-2023-1001",
    name: "LuxCars Rental",
    location: "New York, USA",
    contactPerson: "David Miller",
    email: "info@luxcars.example.com",
    phone: "+1 (555) 123-4567",
    fleetSize: 42,
    status: "verified",
    joinedDate: "2023-05-12"
  },
  {
    id: "P-2023-1002",
    name: "FastTrack Rentals",
    location: "Los Angeles, USA",
    contactPerson: "Sarah Johnson",
    email: "contact@fasttrack.example.com",
    phone: "+1 (555) 987-6543",
    fleetSize: 28,
    status: "verified",
    joinedDate: "2023-06-24"
  },
  {
    id: "P-2023-1003",
    name: "Globe Wheels",
    location: "London, UK",
    contactPerson: "James Smith",
    email: "service@globewheels.example.com",
    phone: "+44 20 1234 5678",
    fleetSize: 35,
    status: "pending",
    joinedDate: "2023-09-08"
  },
  {
    id: "P-2023-1004",
    name: "City Drive Rentals",
    location: "Sydney, Australia",
    contactPerson: "Emma Wilson",
    email: "support@citydrive.example.com",
    phone: "+61 2 9876 5432",
    fleetSize: 19,
    status: "verified",
    joinedDate: "2023-07-30"
  },
  {
    id: "P-2023-1005",
    name: "EcoDrive Solutions",
    location: "Berlin, Germany",
    contactPerson: "Michael Schulz",
    email: "info@ecodrive.example.com",
    phone: "+49 30 1234567",
    fleetSize: 22,
    status: "pending",
    joinedDate: "2023-10-15"
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "verified":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "blacklisted":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function PartnersManagement() {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredPartners = partners.filter(partner => {
    if (activeTab === "all") return true;
    if (activeTab === "verified") return partner.status === "verified";
    if (activeTab === "pending") return partner.status === "pending";
    return true;
  });
  
  const [partnerDetails, setPartnerDetails] = useState<typeof partners[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const openPartnerDetails = (partner: typeof partners[0]) => {
    setPartnerDetails(partner);
    setDetailsOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Partners Management</h2>
        <Button className="bg-[#023e8a] hover:bg-[#00b4d8]">
          Add New Partner
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Partners</TabsTrigger>
          <TabsTrigger value="verified">Verified Partners</TabsTrigger>
          <TabsTrigger value="pending">Verification Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-[#00b4d8]" />
                  <CardTitle>Total Partners</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{partners.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <BadgeCheck className="mr-2 h-5 w-5 text-green-500" />
                  <CardTitle>Verified Partners</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {partners.filter(p => p.status === "verified").length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                  <CardTitle>Pending Verification</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {partners.filter(p => p.status === "pending").length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Partner Agencies</CardTitle>
          <CardDescription>
            {activeTab === "all" ? "All partner agencies" : 
             activeTab === "verified" ? "Verified partner agencies" :
             "Pending verification requests"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List of {activeTab} partner agencies</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fleet Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.id}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.location}</TableCell>
                  <TableCell>{partner.contactPerson}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.fleetSize}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(partner.status)} border`}>
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{partner.joinedDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openPartnerDetails(partner)}
                      >
                        View
                      </Button>
                      {partner.status === "pending" && (
                        <Button variant="default" size="sm" className="bg-[#023e8a] hover:bg-[#00b4d8]">
                          Verify
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
            <DialogDescription>
              Detailed information about the partner agency
            </DialogDescription>
          </DialogHeader>
          
          {partnerDetails && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-[#023e8a]/10">
                  <Building2 className="h-12 w-12 text-[#023e8a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{partnerDetails.name}</h3>
                  <p className="text-sm text-gray-500">{partnerDetails.location}</p>
                </div>
                <Badge className={`${getStatusColor(partnerDetails.status)} border ml-auto`}>
                  {partnerDetails.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Contact Person</h4>
                  <p>{partnerDetails.contactPerson}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Email</h4>
                  <p>{partnerDetails.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Phone</h4>
                  <p>{partnerDetails.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Fleet Size</h4>
                  <p>{partnerDetails.fleetSize} vehicles</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Joined Date</h4>
                  <p>{partnerDetails.joinedDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Partner ID</h4>
                  <p>{partnerDetails.id}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold">Partner Performance</h4>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-green-50 p-3 rounded-md">
                    <h5 className="text-xs text-green-700">Bookings Completed</h5>
                    <p className="text-lg font-bold">143</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h5 className="text-xs text-blue-700">Average Rating</h5>
                    <p className="text-lg font-bold">4.8/5</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md">
                    <h5 className="text-xs text-purple-700">Revenue Generated</h5>
                    <p className="text-lg font-bold">$38,240</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {partnerDetails?.status === "pending" && (
              <Button variant="default" className="bg-[#023e8a] hover:bg-[#00b4d8]">
                Approve Verification
              </Button>
            )}
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
