const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

document.getElementById("Asia").addEventListener("click", () =>
  createCountriesListObject()
    .then(() => getRegionData("Asia"))
    .then(() => drawChart("Asia"))
);
document.getElementById("Europe").addEventListener("click", () =>
  createCountriesListObject()
    .then(() => getRegionData("Europe"))
    .then(() => drawChart("Europe"))
);
document.getElementById("Africa").addEventListener("click", () =>
  createCountriesListObject()
    .then(() => getRegionData("Africa"))
    .then(() => drawChart("Africa"))
);
document.getElementById("Americas").addEventListener("click", () =>
  createCountriesListObject()
    .then(() => getRegionData("Americas"))
    .then(() => drawChart("Americas"))
);
document.getElementById("Oceania").addEventListener("click", () =>
  createCountriesListObject()
    .then(() => getRegionData("Oceania"))
    .then(() => drawChart("Oceania"))
);

const countriesList = {};

const regionList = ["Asia", "Europe", "Africa", "Americas", "Oceania"];

async function createCountriesListObject() {
  if (countriesList === {}) {
    //TODO not working?
    resolve();
    console.log("already got countries");
  } else {
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
}

createCountriesListObject();

// TODO create country dropdown func

async function getCountryData(countryCode) {
  //gets country code, returns {deaths: , confirmed: , recovered: , critical: }
  //TODO check if we already have that info
  try {
    const data = await axios.get(
      CORSapi + "http://corona-api.com/countries/" + countryCode
    );
    const path = data.data.data.latest_data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

const regionData = {};

async function getRegionData(region) {
  //TODO check if we already have that info

  const promises = [];
  for (let i = 0; i < countriesList[region].length; i++) {
    promises.push(getCountryData(countriesList[region][i]));
  }
  const response = await Promise.all(promises);

  regionData[region] = response;
  //   console.log(regionData[region], "inside getRegionData");
}

const canvasCtx = document.getElementById("myChart").getContext("2d");

let labels = [
  //x-axis labels
  "hi",
  "there",
];

let chartData = {
  labels,
  //datapoints
  datasets: [{ data: [13, 25], label: "confirmed cases" }],
};

const config = {
  type: "bar",
  data: chartData,
  options: {
    responsive: true,
  },
};

let myChart = new Chart(canvasCtx, config);

function drawChart(region, datasetName = "confirmed") {
  if (myChart) myChart.destroy(); // if has stuff, delete content
  const names = [];
  const confirmed = [];
  const critical = [];
  const deaths = [];
  const recovered = [];

  // TODO If zero confirmed cases, return null ?
  regionData[region].forEach((el) => {
    console.log(el);
    names.push(el.data.data.name);
    confirmed.push(el.data.data.latest_data.confirmed);
    critical.push(el.data.data.latest_data.critical);
    deaths.push(el.data.data.latest_data.deaths);
    recovered.push(el.data.data.latest_data.recovered);
  });

  chartData.datasets[0].data = confirmed;
  labels = names;
  console.log("labels is ", labels);
  myChart = new Chart(canvasCtx, config);
}
