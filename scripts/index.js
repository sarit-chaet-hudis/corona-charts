const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

document.getElementById("Asia").addEventListener("click", async () => {
  await createCountriesListObject();
  await getRegionData("Asia");
  arrangeDataForChart("Asia");
  drawChart("Asia");
});
document.getElementById("Europe").addEventListener("click", async () => {
  await createCountriesListObject();
  await getRegionData("Europe");
  arrangeDataForChart("Europe");
  drawChart("Europe");
});
document.getElementById("Africa").addEventListener("click", async () => {
  await createCountriesListObject();
  await getRegionData("Africa");
  arrangeDataForChart("Africa");
  drawChart("Africa");
});
document.getElementById("Americas").addEventListener("click", async () => {
  await createCountriesListObject();
  await getRegionData("Americas");
  arrangeDataForChart("Americas");
  drawChart("Americas");
});
document.getElementById("Oceania").addEventListener("click", async () => {
  await createCountriesListObject();
  await getRegionData("Oceania");
  arrangeDataForChart("Oceania");
  drawChart("Oceania");
});

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
  //gets country code, returns all data for that country
  //TODO check if we already have that info
  try {
    const data = await axios.get(
      CORSapi + "http://corona-api.com/countries/" + countryCode
    );
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
}

const canvasCtx = document.getElementById("myChart").getContext("2d");

let chartData = {
  labels: [],
  datasets: [],
};

const config = {
  type: "bar",
  data: chartData,
  options: {
    responsive: true,
  },
};

let myChart;

const dataForCharts = {};

function arrangeDataForChart(region) {
  //gets name of region, creates arrays of data from raw data to display in chart
  let names = []; // Stores Human readable country names
  const confirmed = [];
  const critical = [];
  const deaths = [];
  const recovered = [];

  regionData[region].forEach((el) => {
    if (el) {
      names.push(el.data.data.name);
      confirmed.push(el.data.data.latest_data.confirmed);
      critical.push(el.data.data.latest_data.critical);
      deaths.push(el.data.data.latest_data.deaths);
      recovered.push(el.data.data.latest_data.recovered);
    }
  });
  names = Object.values(names);
  dataForCharts[region] = { names, confirmed, critical, deaths, recovered };
}

function drawChart(region, datasetName = "confirmed") {
  // gets region, datatsetName (confirmed, critical etc.) and makes chart

  if (myChart) myChart.destroy(); // if has stuff, delete content

  // TODO If zero confirmed cases, return null ?

  const newData = [
    { data: dataForCharts[region][datasetName], label: datasetName },
  ];
  console.log(
    `dataForCharts[region].datasetName is: ${dataForCharts[region][datasetName]}`
  );
  chartData.datasets = newData;
  chartData.labels = dataForCharts[region].names;
  myChart = new Chart(canvasCtx, config);
}
