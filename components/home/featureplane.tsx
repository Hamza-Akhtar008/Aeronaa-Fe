import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useHeroTab } from "./HeroTabContext";
import { formatPrice } from "@/lib/utils/currency"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"

const flightRoutes = [
	{
		from: "London",
		to: "New York",
		image: "/images/flight1.png",
		rating: 4,
		reviews: 200,
		price: "590",
	},
	{
		from: "Dubai",
		to: "Sharjah",
		image: "/images/flight2.png",
		rating: 3,
		reviews: 305,
		price: "450,",
	},
	{
		from: "Sydney",
		to: "Melbourne",
		image: "/images/flight3.png",
		rating: 3,
		reviews: 500,
		price: "200",
	},
]

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`w-4 h-4 ${star <= rating ? "fill-[#ffb400] text-[#ffb400]" : "fill-gray-200 text-gray-200"}`}
				/>
			))}
		</div>
	)
}

export function BookYourFlight() {
	const router = useRouter();
	const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
	const [isClient, setIsClient] = useState(false);
	const { setActiveTab, heroRef } = useHeroTab();
	const [selectedCurrency, setSelectedCurrency] = useState("USD");
	const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });

	// Detect country and currency from localStorage/sessionStorage
	useEffect(() => {
		let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
		if (country) {
			const currency = getCurrencyByLocation(country);
			setSelectedCurrency(currency);
		} else {
			setSelectedCurrency("USD");
		}
	}, []);

	// Fetch exchange rates for selected currency
	useEffect(() => {
		if (selectedCurrency === "USD") {
			setExchangeRates({ USD: 1 });
			return;
		}
		const fetchRates = async () => {
			try {
				const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
				const data = await response.json();
				setExchangeRates({ ...data.rates, USD: 1 });
			} catch (error) {
				setExchangeRates({ USD: 1 });
			}
		};
		fetchRates();
	}, [selectedCurrency]);

	// Check if we're on the client side
	useEffect(() => {
		setIsClient(true);
	}, []);



	const handleFlightRouteClick = async (route: { from: string; to: string }) => {
		if (!isClient) return;
		setLoadingRoute(`${route.from}-${route.to}`);
		try {
			// 1. Validate 'from' and 'to' using autocomplete API
			const fetchIataCode = async (query: string) => {
				if (!query || query.length < 2) return null;
				const options = {
					method: "GET",
					url: "https://agoda-com.p.rapidapi.com/flights/auto-complete",
					params: { query },
					headers: {
						"x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
						"x-rapidapi-host": "agoda-com.p.rapidapi.com",
					},
				};
				const response = await axios.request(options);
				console.log("Autocomplete response for", query, ":", response.data);
				const suggestions = response.data.suggestions || [];
				// Try to find a matching city or airport (loose match)
				let found = suggestions.find((s: any) =>
					s.name?.toLowerCase().includes(query.toLowerCase()) ||
					s.cityName?.toLowerCase().includes(query.toLowerCase()) ||
					s.displayName?.toLowerCase().includes(query.toLowerCase())
				);
				// Fallback: use the first suggestion if no loose match
				if (!found && suggestions.length > 0) found = suggestions[0];
				let code = null;
				if (found?.tripLocations?.length) {
					// Prefer city code (type 0)
					code = found.tripLocations.find((loc: any) => loc.type === 0)?.code;
				}
				if (!code && found?.airports?.length) {
					code = found.airports[0].code;
				}
				if (!code && found?.code) {
					code = found.code;
				}
				if (!code) {
					console.log(`No valid IATA code found for query: ${query}`);
				}
				return code;
			};

			const originCode = await fetchIataCode(route.from);
			const destCode = await fetchIataCode(route.to);
			if (!originCode || !destCode) {
				console.log("Invalid route: Could not find valid airport codes for selected cities.");
				setLoadingRoute(null);
				return;
			}

			// Setup dates - one day after current date for one-way flight
			const today = new Date();
			const departDate = new Date(today);
			departDate.setDate(today.getDate() + 1);
			const formattedDepartDate = departDate.toISOString().split('T')[0];

			// Make a direct call to RapidAPI
			const apiUrl = "https://agoda-com.p.rapidapi.com/flights/search-one-way";
			const params = {
				origin: originCode,
				destination: destCode,
				departureDate: formattedDepartDate,
				adults: 1,
				children: 0,
				infants: 0,
				cabinType: "Economy",
			};
			const options = {
				method: "GET",
				url: apiUrl,
				params,
				headers: {
					"x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
					"x-rapidapi-host": "agoda-com.p.rapidapi.com",
				},
			};
			const response = await axios.request(options);
			const agodaData = response.data?.data;
			let isValid = false;
			if (Array.isArray(response.data) && response.data.length > 0) {
				isValid = true;
			} else if (agodaData?.bundles && Array.isArray(agodaData.bundles) && agodaData.bundles.length > 0) {
				isValid = true;
			}
			if (isValid) {
				sessionStorage.setItem("flightSearchResults", JSON.stringify(agodaData));
			} else {
				sessionStorage.setItem(
					"flightSearchResults",
					JSON.stringify({ error: "Invalid Agoda API response", agodaResponse: response.data })
				);
			}
			// Store search parameters for display
			sessionStorage.setItem(
				"flightSearchParams",
				JSON.stringify({
					tripType: "one-way",
					fromname: route.from,
					toname: route.to,
					departureDate: formattedDepartDate,
					returnDate: "",
					adults: 1,
					children: 0,
					infants: 0,
					cabinClass: "Economy"
				})
			);
			// Navigate to the flights page with query parameters
			const url = `/flights?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&departureDate=${formattedDepartDate}&tripType=one-way&adults=1&children=0&infants=0&cabinClass=Economy`;
			router.push(url);
		} catch (error) {
			console.error("Error preparing flight search:", error);
			if (isClient) {
				console.log("There was an error loading flights. Please try again.");
			}
		} finally {
			setLoadingRoute(null);
		}
	};

	// Handler for promotional Go now button
	const handleGoNowPromo = () => {
		setActiveTab("flights");
		if (heroRef && heroRef.current) {
			heroRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className=" w-full mx-auto bg-[#edfaff] p-8 mb-10 rounded-lg">
			{/* Header Section */}
			<div className="mb-8">
			    <h1 className="  text-black mb-4 text-[32px] font-bold">Plan Your Flight Journey</h1>
				<div className="flex flex-wrap gap-6 text-sm text-black">
					<span
						className="border-b-2 border-[#d1d8da]"
						style={{
							borderBottomStyle: "dashed",
							borderBottomWidth: "2px",
							borderBottomColor: "#d1d8da",
							borderImage:
								"repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1",
						}}
					>
						Official Partner of Global Rail Operators
					</span>
					<span
						className="border-b-2 border-[#d1d8da]"
						style={{
							borderBottomStyle: "dashed",
							borderBottomWidth: "2px",
							borderBottomColor: "#d1d8da",
							borderImage:
								"repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1",
						}}
					>
						Cheap Trains in Europe and Asia
					</span>
					<span
						className="border-b-2 border-[#d1d8da]"
						style={{
							borderBottomStyle: "dashed",
							borderBottomWidth: "2px",
							borderBottomColor: "#d1d8da",
							borderImage:
								"repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1",
						}}
					>
						Multiple Currencies Accepted
					</span>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Flight Route Cards */}
				<div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{flightRoutes.map((route) => (
						<Card
							key={`${route.from}-${route.to}`}
							className="overflow-hidden bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => handleFlightRouteClick(route)}
						>
							<div className="aspect-[4/3] bg-white rounded-lg overflow-hidden relative">
								<img
									src={route.image || "/placeholder.svg"}
									alt={`${route.from} to ${route.to}`}
									className="w-full h-full object-cover p-4 rounded-3xl"
								/>
								{loadingRoute === `${route.from}-${route.to}` && (
									<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
										<span className="text-black font-semibold">Loading...</span>
									</div>
								)}
							</div>
							<div className="p-6">
								<div className="flex items-center justify-between mb-3 w-full">
									<h3 className="text-xl font-semibold text-gray-900">{route.from}</h3>
									<ArrowRight className="w-8 h-6 text-black mx-2" />
									<h3 className="text-xl font-semibold text-gray-900">{route.to}</h3>
								</div>

								<div className="flex items-center gap-2 mb-3">
									<StarRating rating={route.rating} />
								</div>
								<div className="flex items-center justify-between text-sm text-gray-600">
									<span className="font-bold text-black">
										{route.reviews} reviews
									</span>
									<span className="font-bold text-black">
										From{" "}
										{formatPrice(
											Math.floor(parseInt(route.price))* (exchangeRates[selectedCurrency] || 1),
											selectedCurrency
										)}
									</span>
								</div>
							</div>
						</Card>
					))}
				</div>

				{/* Promotional Sidebar */}
				<div className="lg:col-span-1 flex justify-center h-full">
					<Card className="flex flex-col justify-center items-center p-3 gap-4 sm:gap-5 w-full max-w-xs sm:w-[274px]  sm:h-full h-auto bg-gradient-to-b from-[#042E67] to-[#5BA1FF] rounded-[22px] overflow-hidden text-white border-0">

						<div className="aspect-[4/3] w-full overflow-hidden relative">
							<img
								src="/images/flight4.png"
								alt="Flight travel"
								className="w-full h-full object-cover p-2 rounded-[22px]"
							/>
							{loadingRoute === `${flightRoutes[0].from}-${flightRoutes[0].to}` && (
								<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
									<span className="text-black font-semibold">Loading...</span>
								</div>
							)}
						</div>
						<div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 w-full text-center">
							<h3 className="text-lg sm:text-xl font-semibold leading-tight">Cheap flight tickets across the world</h3>
							<Button
								className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 sm:py-3"
								onClick={handleGoNowPromo}
							>
								Go now
							</Button>
						</div>
					</Card>
				</div>

			</div>
		</div>
	)
}
