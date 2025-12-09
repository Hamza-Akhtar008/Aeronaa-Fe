export async function getCountryByCurrency(country: string) {
  try {
    if (!country) return null;
    // If country is already a 2-letter code, use /alpha/, else fallback to /name/
    let res;
    if (country.length === 2) {
      res = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
    } else {
      res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    }
    if (!res.ok) throw new Error("Failed to fetch country for currency");
    const data = await res.json();
    const countryData = Array.isArray(data) ? data[0] : data;
    if (countryData) {
      return {
        countryName: countryData.name.common,
        countryCode: countryData.cca2,
        flag: countryData.flags.png,
      };
    }
    return null;
  } catch (err) {
    console.error("Error fetching country:", err);
    return null;
  }
}
