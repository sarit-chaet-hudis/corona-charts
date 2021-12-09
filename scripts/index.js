const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

document
  .getElementById("Asia")
  .addEventListener("click", () => getCountriesByRegion("Asia"));
document
  .getElementById("Europe")
  .addEventListener("click", () => getCountriesByRegion("Europe"));
document
  .getElementById("Africa")
  .addEventListener("click", () => getCountriesByRegion("Africa"));
document
  .getElementById("Americas")
  .addEventListener("click", () => getCountriesByRegion("Americas"));
document
  .getElementById("Oceania")
  .addEventListener("click", () => getCountriesByRegion("Oceania"));

async function getData(countryCode) {
  const data = await axios.get(
    CORSapi + "http://corona-api.com/countries/" + countryCode
  );
  console.log(data.data.data.latest_data); //gets deathRate, confirmed, critical, deaths, recovered
}

async function getCountriesByRegion(region) {
  const countries = await axios.get(
    CORSapi + "https://restcountries.herokuapp.com/api/v1/region/" + region
  );
  console.log(countries);
  for (let i = 0; i < countries.data.length; i++) {
    console.log(countries.data[i].cca2);
  }
}

// getData("AF");
// Asia Europe Africa Americas Oceania
// getCountriesByRegion("Oceania");
