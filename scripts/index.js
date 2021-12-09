const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

document
  .getElementById("Asia")
  .addEventListener("click", () => showRegionData("Asia"));
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
  //gets country code, returns deathRate, confirmed, critical, deaths, recovered
  const data = await axios.get(
    CORSapi + "http://corona-api.com/countries/" + countryCode
  );
  return data.data.data.latest_data;
}

async function showRegionData(region) {
  console.log(`countriesList[region] is ${countriesList[region]}`);
  for (let i = 0; i < countriesList[region].length; i++) {
    //TODO store this data in an object for all region's countries?
    // or each country with its own data?
    // TODO store in local storage unless it's already there
    console.log(await getData(countriesList[region][i]));
  }
}
