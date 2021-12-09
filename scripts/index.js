const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

document
  .getElementById("Asia")
  .addEventListener("click", () => showRegionData("Asia"));
document
  .getElementById("Europe")
  .addEventListener("click", () => showRegionData("Europe"));
document
  .getElementById("Africa")
  .addEventListener("click", () => showRegionData("Africa"));
document
  .getElementById("Americas")
  .addEventListener("click", () => showRegionData("Americas"));
document
  .getElementById("Oceania")
  .addEventListener("click", () => showRegionData("Oceania"));

const countriesList = {};

const regionList = ["Asia", "Europe", "Africa", "Americas", "Oceania"];

async function createCountriesListObject() {
  // Runs on region list and creates an object that holds arrays of countries per region.
  for (region of regionList) {
    const countriesArr = [];
    const countries = await axios.get(
      CORSapi + "https://restcountries.herokuapp.com/api/v1/region/" + region
    );

    for (let i = 0; i < countries.data.length; i++) {
      countriesArr.push(countries.data[i].cca2);
    }
    countriesList[region] = countriesArr;
  }
}

createCountriesListObject();

// TODO create country dropdown func

async function getData(countryCode) {
  //gets country code, returns {deaths: , confirmed: , recovered: , critical: }
  try {
    const data = await axios.get(
      CORSapi + "http://corona-api.com/countries/" + countryCode
    );
    const path = data.data.data.latest_data;
    return {
      countryName: data.data.data.name,
      confirmed: path.confirmed,
      critical: path.critical,
      deaths: path.deaths,
      recovered: path.recovered,
    };
    // TODO If zero confirmed cases, return null
  } catch (error) {
    console.log(error);
  }
}

async function showRegionData(region) {
  const promises = [];
  for (let i = 0; i < countriesList[region].length; i++) {
    //TODO store this data in an object for all region's countries?
    // or each country with its own data?
    // TODO store in local storage unless it's already there
    promises.push(await getData(countriesList[region][i]));
  }
  const response = await Promise.all([promises]);
  console.log(response);
}
