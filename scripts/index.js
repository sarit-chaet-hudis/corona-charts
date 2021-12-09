const CORSapi = "https://intense-mesa-62220.herokuapp.com/";
const countryCodes = {
  Afganistan: "AF",
};
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
getCountriesByRegion("Asia");
