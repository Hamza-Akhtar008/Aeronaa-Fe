"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Archive,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { PackageDetailsModal } from "./package-details-modal"
import { DeletePakage, GetUmrahPakageall, GetUmrahPakageallVEndor } from "@/lib/umrah_api"
import toast, { Toaster } from "react-hot-toast"
import { useAuth } from "@/store/authContext"

interface Package {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  packageName: string
  packageCode: string
  packageType: string
  duration: number
  startDate: string
  endDate: string
  citiesCovered: string[]
  shortDescription: string
  longDescription: string
  makkahHotelName: string
  makkahStarRating: string
  distanceFromHaram: number
  medinaHotelName: string
  medinaStarRating: string
  distanceFromMasjidNabwi: number
  roomTypes: string
  mealsIncluded: string[]
  flightIncluded: number
  airportTransfersIncluded: number
  interCityTransportType: string
  ziyaratIncluded: number
  tentativeDepartureDate: string
  tentativeReturnDate: string
  airLineName: string
  flightClass: string
  routeType: string
  departureCity: string
  arrivalCity: string
  flightDuration: number
  flightNotes: string
  currency: string
  doubleSharingPrice: number
  trippleSharingPrice: number
  quadSharingPrice: number
  discountPercent: number
  refundPolicy: string
  paymentTerms: string
  specialNotes: string
  vendorNotes: string
  extrasIncluded: string[]
  religiousServicesIncluded: string[]
  hotelImages: string[]
  coverImage: string
}



const ITEMS_PER_PAGE = 10

export function PackagesTable() {
 
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [seasonFilter, setSeasonFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const {auth,loading}=useAuth();
  


 
  useEffect(()=>
  {
    const allpakage = async()=>
    {
let response ;
      if(auth?.role==="admin")
      {

        response = await GetUmrahPakageall();
      }
      else {
        response = await GetUmrahPakageallVEndor();
      }
   setPackages(response);
    }
    allpakage();
  },[])
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.packageCode.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || pkg.packageType === typeFilter
      const matchesSeason = seasonFilter === "all" || seasonFilter === "all"
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && pkg.isActive) ||
        (statusFilter === "inactive" && !pkg.isActive)

      return matchesSearch && matchesType && matchesSeason && matchesStatus
    })
  }, [packages, searchQuery, typeFilter, seasonFilter, statusFilter])

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPackages = filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPackages(paginatedPackages.map((pkg) => pkg.id.toString()))
    } else {
      setSelectedPackages([])
    }
  }

  const handleSelectPackage = (packageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPackages([...selectedPackages, packageId])
    } else {
      setSelectedPackages(selectedPackages.filter((id) => id !== packageId))
    }
  }

  const handleStatusToggle = (packageId: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id.toString() === packageId
          ? { ...pkg, isActive: !pkg.isActive, updatedAt: new Date().toISOString() }
          : pkg,
      ),
    )
    toast.success(
    
    "Package status has been updated successfully."
    )
  }

  const handleDuplicate = (packageId: string) => {
    const originalPackage = packages.find((pkg) => pkg.id.toString() === packageId)
    if (originalPackage) {
      const newPackage: Package = {
        ...originalPackage,
        id: Date.now(),
        packageName: `${originalPackage.packageName} (Copy)`,
        packageCode: `${originalPackage.packageCode}-COPY`,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setPackages([newPackage, ...packages])
     
    }
  }

  const handleView = (packageId: string) => {
    const pkg = packages.find((p) => p.id.toString() === packageId)
    if (pkg) {
      setSelectedPackage(pkg)
      setIsModalOpen(true)
    }
  }
 const handleEdit = (packageId: string) => {
   router.push(`/umarah-pakage/edit-package/${packageId}`)
  }
  const handleDelete = (packageId: string) => {
    setPackageToDelete(packageId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async() => {
    if (packageToDelete) {
      setPackages((prev) => prev.filter((pkg) => pkg.id.toString() !== packageToDelete))
      const response =await DeletePakage(packageToDelete);
      setTimeout(() => {
        
        toast.success(
        
          "Package has been deleted successfully."
        )
      }, 100);
    }
    setDeleteDialogOpen(false)
    setPackageToDelete(null)
  }

  const handleBulkArchive = () => {
    setPackages((prev) =>
      prev.map((pkg) => (selectedPackages.includes(pkg.id.toString()) ? { ...pkg, isActive: false } : pkg)),
    )
    setSelectedPackages([])
  
  }

  const handleBulkDelete = () => {
   
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
        {isActive ? "Active" : "Inactive"}
      </Badge>
    )
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPackage(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Package Management</CardTitle>
              <CardDescription>View and manage all your Umrah packages</CardDescription>
            </div>
             {loading === true && auth?.role !== "admin" &&(<>
              <Link href="/dashboard/add-package">
              <Button className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#012a5e] hover:to-[#0096b8] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Package
              </Button>
            </Link>
             </>)}
           
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Ramadan">Ramadan</SelectItem>
                  <SelectItem value="Off-Peak">Off-Peak</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                   
                    <th className="text-left p-4 font-medium">Package</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Duration</th>
                    <th className="text-left p-4 font-medium">Hotels</th>
                    <th className="text-left p-4 font-medium">Dates</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Flight</th>
                    <th className="w-12 p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                    
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{pkg.packageName}</div>
                          <div className="text-sm text-gray-500">{pkg.packageCode}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{pkg.packageType}</Badge>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{pkg.duration} days</td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">{pkg.makkahHotelName}</div>
                          <div className="text-gray-500">{pkg.medinaHotelName}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{new Date(pkg.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(pkg.endDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">
                            {pkg.currency} {pkg.doubleSharingPrice.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Double sharing</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleStatusToggle(pkg.id.toString())}>
                          {getStatusBadge(pkg.isActive)}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">{pkg.airLineName}</div>
                          <div className="text-gray-500 capitalize">{pkg.flightClass}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(pkg.id.toString())}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                   { auth?.role != "admin" && (
  <>
    <DropdownMenuItem onClick={() => handleEdit(pkg.id.toString())}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      onClick={() => handleDelete(pkg.id.toString())}
      className="text-red-600"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </>
)}
                           
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredPackages.length)} of{" "}
                {filteredPackages.length} packages
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <RefreshCw className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No packages found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || typeFilter !== "all" || seasonFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first package"}
              </p>
              {loading === true && auth?.role !== "admin" &&(
<>
<Link href="/dashboard/add-package">
                <Button className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#012a5e] hover:to-[#0096b8] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              </Link></>
              )}
              
            </div>
          )}
        </CardContent>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Package</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this package? This action cannot be undone and will remove all
                associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>

      <PackageDetailsModal package={selectedPackage} isOpen={isModalOpen} onClose={handleCloseModal} />
       <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  )
}
