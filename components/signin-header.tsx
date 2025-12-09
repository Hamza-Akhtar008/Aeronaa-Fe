"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDown, User, LogOut, LayoutDashboard, Menu } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/store/authContext"
import { usePathname, useRouter } from "next/navigation"
import { FetchUser } from "@/lib/api"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { CURRENCIES } from "@/lib/utils/currency"
import { languages } from "@/lib/utils/language"
import CountryFlag from "./countryflag"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { getCountryByCurrency } from "@/lib/utils/getcountry"
import { useCurrencyRegion } from "@/hooks/useCurrencyRegion"
import { NotificationPanel } from "./notification-panel"


// If using react-i18next
// import { useTranslation } from "react-i18next";

export function SigninSiteHeader() {
  // const { t, i18n } = useTranslation(); // Uncomment if using react-i18next
   const {
    regionCountry,
    currencyCountry,
    currency,
    countryData,
    updateCurrency,
    
  } = useCurrencyRegion()
  const { auth, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name?: string } | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [selectedcountry, setselectedcountry] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null)
  // Build currency list from CURRENCIES usercountryobject
  const currencyList = Object.entries(CURRENCIES).map(([code, { name, country }]) => ({
    code: String(code),
    name: String(name),
    country: String(country),
  }))
  const [selectedCurrency, setSelectedCurrency] = useState(currencyList[0])
  // State for currency search
  const [currencySearch, setCurrencySearch] = useState("")
  // Filtered currency list based on search
  const filteredCurrencyList = currencyList.filter(
    ({ code, name, country }) =>
      code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      country.toLowerCase().includes(currencySearch.toLowerCase()),
  )

  useEffect(() => {
    let data = sessionStorage.getItem("usercountry")
    if (!data) {
      data = localStorage.getItem("usercountry")
    }
    let data2 = localStorage.getItem("userCountry")
    if (!data2) {
      data2 = sessionStorage.getItem("userCountry")
    }

    if (data && data2) {
      setselectedcountry(data)
      const detectedCurrency = getCurrencyByLocation(data2)
      const foundCurrency = currencyList.find((code) => code.code === detectedCurrency)
      if (foundCurrency) {
        setSelectedCurrency(foundCurrency)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedCurrency?.code) {
      ; (async () => {
        const country = await getCountryByCurrency(selectedcountry)
        if (country) {
          setSelectedCountry({ name: country.countryName, code: country.countryCode })
        }
      })()
    }
  }, [selectedCurrency])
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)

  //outside click close popups
  const langRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  useEffect(() => {
    if (auth) {
      const fetchUserData = async () => {
        try {
          const response = await FetchUser(auth.id.toString())
          setUser(response)
        } catch (error) {
          console.error("Failed to fetch user:", error)
        }
      }
      fetchUserData()
    }
  }, [auth])

  useEffect(() => {
    localStorage.setItem("lang", JSON.stringify(selectedLanguage))
    localStorage.setItem("currency", JSON.stringify(selectedCurrency))
  }, [selectedLanguage, selectedCurrency])

  return (
    <header
      className={`w-full max-w-[103rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4  z-[99999] bg-[#fafbfc]  ${pathname && pathname !== "/" ? " top-0 border-none" : ""
        } ${pathname === "/" ? "bg-[#fafbfc]" : "bg-[#fafbfc]"}`}
    >
      <div className="mx-auto px-2 sm:px-6 ">
        <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 justify-between w-full sm:w-auto">
            <Link href="/" passHref>
              <Image
                src="/images/aeronalogo.png"
                alt="Aerona Logo"
                width={200}
                height={200}
                priority
                className="cursor-pointer"
              />
            </Link>

     <div className="sm:hidden flex flex-row items-center gap-3">
        <NotificationPanel />
  <Sheet>
    <SheetTrigger asChild>
      {/* 🔥 This wrapper makes everything clickable & aligned */}
      <div className="flex flex-row items-center gap-3 cursor-pointer">
        <Menu className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-transform transform scale-110" />
      </div>
    </SheetTrigger>

    <SheetContent className="bg-white rounded-lg shadow-lg p-6">
      {/* ---------------- MOBILE AUTH SECTION ---------------- */}
      {!auth ? (
        <>
          <Link
            href="/register"
            className="block px-4 py-3 mb-3 text-sm font-medium text-white bg-[#0a3a7a] border rounded-md hover:bg-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#005bb5] transition-all"
          >
            List Your Property
          </Link>

          <Link
            href="/signin"
            className="block px-4 py-3 mb-3 text-sm font-medium text-white bg-[#0a3a7a] border rounded-md hover:bg-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#005bb5] transition-all"
          >
            Login
          </Link>

          <Link
            href="/user/register"
            className="block px-4 py-3 mb-3 text-sm font-medium bg-[#0a3a7a] text-white border hover:bg-[#005bb5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#005bb5] transition-all"
          >
            Sign up
          </Link>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center text-sm font-semibold text-blue-700">
            {user?.name || "Account"}
          </div>

          {/* Dashboard */}
          <Link
            href={
              auth.role === "admin"
                ? "/admin"
                : auth.role === "vendor"
                ? "/Dashboard"
                : auth.role === "carrental"
                ? "/car-rental-dashboard"
                : auth.role === "support"
                ? "/support"
                : auth.role === "property"
                ? "/property-dashboard":
                auth.role=="umrah"?"/umarah-pakage/dashboard"
                : "/user/bookings"
            }
            className="flex items-center px-4 py-3 mb-2 text-sm text-gray-700 hover:bg-[#f1f1f1] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a7a] transition-all"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
          </Link>

          {/* Profile */}
         

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 mb-2 text-sm text-gray-700 hover:bg-[#f1f1f1] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3a7a] transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      )}

      {/* ------------------- Currency Section -------------------- */}
      <div className="flex flex-col gap-4 m-3 p-2 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Currency & Region
        </h3>

        <div className="flex items-center gap-4">
          {/* Currency Selector */}
          <div className="relative flex-1" ref={currencyRef}>
            <button
              onClick={() => setCurrencyMenuOpen((prev) => !prev)}
              className="flex items-center justify-between w-full gap-1 text-sm font-medium text-[#0a3a7a] bg-[#f9f9f9] border border-gray-300 hover:bg-[#e0e0e0] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0a3a7a] transition-all"
            >
              <span>
                {selectedCurrency.code} - {selectedCurrency.name}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {currencyMenuOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0a3a7a] transition-all font-semibold"
                    autoFocus
                  />
                </div>

                {filteredCurrencyList.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No currencies found
                  </div>
                ) : (
                  filteredCurrencyList.map(({ code, name, country }) => (
                    <button
                      key={code}
                      onClick={() => {
                        updateCurrency(country);
                        setCurrencyMenuOpen(false);
                        window.location.reload();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-[#0a3a7a] transition-all"
                    >
                      {code} - {name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Country Flag */}
          <div className="flex items-center">
            <CountryFlag
              countryCode={selectedCountry?.code}
              height={80}
              width={40}
            />
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</div>




          </div>

          {/* Mobile Drawer Trigger */}


          <div className="hidden sm:flex sm:flex-row items-center space-x-4 w-auto ml">
            {/* 🌍 Currency & Country - Always Shown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* 💰 Currency Selector */}
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-[14px]  text-[#0a3a7a] mr-3 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-50 font-semibold"
                >
                  {selectedCurrency.code}

                </button>
                {currencyMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg  max-h-60 overflow-y-auto w-56 z-[99999]">
                    {/* Search input for filtering currencies */}
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search currency..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring"
                        autoFocus
                      />
                    </div>
                    {filteredCurrencyList.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-400">No currencies found</div>
                    ) : (
                      filteredCurrencyList.map(({ code, name, country }) => (
                        <button
                          key={code}
                          onClick={async () => {
                            localStorage.setItem("userCountry", country)
                            sessionStorage.setItem("userCountry", country)
                            setSelectedCurrency({ code, name, country })
                            setCurrencyMenuOpen(false)
                            window.location.reload()
                          }}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          {code} - {name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 🏳️ Country Flag */}
              <div className="flex items-center border p-2 rounded-xl">
                <CountryFlag countryCode={selectedCountry?.code} height={80} width={40} />
              </div>
            </div>

            {/* 🔑 Auth Section */}
            {!auth ? (
              <>
                <Link
                  href="/register"
                  className="text-sm  text-[#0a3a7a] hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 text-[14px] font-semibold"
                >
                  List Your Property
                </Link>

                <Link
                  href="/signin"
                  className="text-sm  text-[#0a3a7a] hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 text-[14px] font-semibold"
                >
                  Login
                </Link>

                <Link
                  href="/user/register"
                  className="bg-[#0a3a7a] text-white text-sm  px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-[14px] font-semibold"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6 relative">
                <div className="flex items-center text-sm font-semibold text-blue-700">
                  {user?.name ? <span>{user.name}</span> : <span>Account</span>}
                </div>
                      <NotificationPanel/>

                {/* 👤 Account Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>


                  {menuOpen && (
                    <div
                      className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-44 z-50"
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                 
                        <Link
                           href={
              auth.role === "admin"
                ? "/admin"
                : auth.role === "vendor"
                ? "/Dashboard"
                : auth.role === "carrental"
                ? "/car-rental-dashboard"
                : auth.role === "support"
                ? "/support"
                : auth.role === "property"

                ? "/property-dashboard":
                  auth.role=="umrah"?"/umarah-pakage/dashboard"
                : "/user/bookings"
            }
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                        </Link>
                  
                    


                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </header>
  )
}
