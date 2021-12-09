const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

document.getElementById("Asia").addEventListener("click", () => print("Asia"));
document
  .getElementById("Europe")
  .addEventListener("click", () => print("Europe"));
document
  .getElementById("Africa")
  .addEventListener("click", () => print("Africa"));
document
  .getElementById("Americas")
  .addEventListener("click", () => print("Americas"));
document
  .getElementById("Oceania")
  .addEventListener("click", () => print("Oceania"));

async function getData(countryCode) {
  //gets country code, returns deathRate, confirmed, critical, deaths, recovered
  const data = await axios.get(
    CORSapi + "http://corona-api.com/countries/" + countryCode
  );
  return data.data.data.latest_data;
}

async function getCountriesByRegion(region) {
  //gets list of countries by region and saves them for later use
  const countries = await axios.get(
    CORSapi + "https://restcountries.herokuapp.com/api/v1/region/" + region
  );
  const countriesArr = [];
  for (let i = 0; i < countries.data.length; i++) {
    countriesArr.push(countries.data[i].cca2);
  }
  return countriesArr;
}

const countriesList = {
  Asia: getCountriesByRegion("Asia"),
  Europe: getCountriesByRegion("Europe"),
  Africa: getCountriesByRegion("Africa"),
  Americas: getCountriesByRegion("Americas"),
  Oceania: getCountriesByRegion("Oceania"),
};

async function print(region) {
  console.log(await countriesList[region]);
}

async function showData() {
  getData("AF");
}
