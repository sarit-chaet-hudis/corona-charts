const CORSapi = "https://intense-mesa-62220.herokuapp.com/";

const countriesList = {};
const regionList = ["Asia", "Europe", "Africa", "Americas", "Oceania"];

const regionData = {};

const canvasCtx = document.getElementById("myChart").getContext("2d");

let chartData = {
  labels: [],
  datasets: [],
};

const config = {
  type: "bar",
  data: chartData,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return this.getLabelForValue(value).length > 12
              ? this.getLabelForValue(value).substr(0, 11) + ".."
              : this.getLabelForValue(value);
          },
        },
      },
      //TODO limit lenght of lables
    },
  },
};

const chartColors = ["#158f04", "#a4af31", "#ffce7a", "#f18956", "#d43d51"];

let myChart;

const dataForCharts = {};

const state = {
  datasetButtonsVisible: false,
  selectSingleCountryVisible: false,
  loading: false,
};

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

async function createCountriesListObject() {
  if (!state.loading) {
    toggleLoading();
  }
  const countryStatsDiv = document.querySelector(".coutryStats");
  countryStatsDiv.innerHTML = "";

  if (Object.keys(countriesList).length === 0) {
    //checks if countriesList isnt availabe in global var
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
      localStorage.setItem(
        `countriesList[${region}]`,
        JSON.stringify(countriesArr)
      );
    }
  }
}

function toggleLoading() {
  state.loading = !state.loading;
  if (state.loading) {
    const allButts = document.querySelectorAll("button");
    allButts.forEach((b) => (b.disabled = true));
    document.getElementById("loader").style.display = "flex";
  } else {
    const allButts = document.querySelectorAll("button");
    allButts.forEach((b) => (b.disabled = false));
    document.getElementById("loader").style.display = "none";
  }
}

async function getCountryData(countryCode) {
  //gets country code, returns all data for that country

  try {
    const data = await axios.get(
      CORSapi + "http://corona-api.com/countries/" + countryCode
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getRegionData(region) {
  const butts = document.querySelectorAll(".regionButtons button");
  butts.forEach((b) => b.classList.remove("selectedRegion"));
  document.getElementById(region).classList.add("selectedRegion");
  if (!regionData[region]) {
    const promises = [];
    for (let i = 0; i < countriesList[region].length; i++) {
      // TODO If zero confirmed cases, return null / skip country..?

      promises.push(getCountryData(countriesList[region][i]));
    }
    const response = await Promise.all(promises);

    regionData[region] = response;
  } else {
    console.log(`we already got region data for ${region}`);
  }
}

function arrangeDataForChart(region) {
  // if (!dataForCharts[region]) { //TODO
  //gets name of region, creates arrays of data from raw data to display in chart
  let names = []; // Human readable country names
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
  // } else {
  //   console.log(`dataForCharts${[region]} already exists`);
  // }
}

function activateDatasetButtons() {
  const selectedRegion = document.querySelector(".selectedRegion").id;
  document
    .getElementById("confirmed")
    .addEventListener("click", () => drawChart(selectedRegion, "confirmed"));
  document
    .getElementById("deaths")
    .addEventListener("click", () => drawChart(selectedRegion, "deaths"));
  document
    .getElementById("recovered")
    .addEventListener("click", () => drawChart(selectedRegion, "recovered"));
  document
    .getElementById("critical")
    .addEventListener("click", () => drawChart(selectedRegion, "critical"));
}

function drawChart(region, datasetName = "confirmed") {
  // gets region, datatsetName (confirmed, critical etc.) and makes chart
  if (state.loading) {
    toggleLoading();
  }
  if (!state.datasetButtonsVisible) {
    document.querySelector(".datasetTypeButtons").style.display = "block";
    state.datasetButtonsVisible = true;
  }
  activateDatasetButtons();
  const butts = document.querySelectorAll(".datasetTypeButtons button");
  butts.forEach((b) => b.classList.remove("selectedDatasetName"));
  document.getElementById(datasetName).classList.add("selectedDatasetName");

  if (myChart) myChart.destroy(); // if has stuff, delete content

  const newData = [
    {
      data: dataForCharts[region][datasetName],
      label: datasetName,
      backgroundColor: chartColors,
    },
  ];

  chartData.datasets = newData;
  chartData.labels = dataForCharts[region].names;
  myChart = new Chart(canvasCtx, config);

  showCountryOptions(region);
}

function showCountryOptions(region) {
  // Fills the dropdown with country options to select from that region
  // and adds relevant event listeners to show country stats
  if (!state.selectSingleCountryVisible) {
    document.querySelector(".countrySelect").style.display = "flex";
    state.selectSingleCountryVisible = true;
  }
  const countryInRegion = document.getElementById("countryInRegion");
  countryInRegion.innerHTML = "";
  dataForCharts[region].names.forEach((country) => {
    const opt = document.createElement("option");
    opt.textContent = country;
    opt.value = country;
    countryInRegion.appendChild(opt);
  });
  countryInRegion.addEventListener("change", () =>
    showCountryStats(region, countryInRegion.value)
  );
}

function showCountryStats(region, selectedCountry) {
  // Shows specific stats of selected country in table form
  const countryStatsDiv = document.querySelector(".coutryStats");
  try {
    const indexCountry = regionData[region].findIndex(
      (d) => d.data.data.name === selectedCountry
    );
    const countryData = regionData[region][indexCountry].data.data;
    //console.log(indexCountry);

    const dataTable = document.createElement("table");
    let tData = `<tr>
      <th>${selectedCountry}</th><th>Last update: ${countryData.updated_at.slice(
      0,
      countryData.updated_at.indexOf("T")
    )}</th>
    </tr>
    <tr><td>Population</td>  <td>${countryData.population.toLocaleString()}</td></tr>
    <tr><td>Deaths</td>  <td>${countryData.latest_data.deaths.toLocaleString()}</td></tr>
    <tr><td>Confirmed cases</td>  <td>${countryData.latest_data.confirmed.toLocaleString()}</td></tr>
    <tr><td>Recovered</td>  <td>${countryData.latest_data.recovered.toLocaleString()}</td></tr>
    <tr><td>In critical condition</td>  <td>${countryData.latest_data.critical.toLocaleString()}</td></tr>
    <tr><td>Cases per million</td>  <td>${
      countryData.latest_data.calculated.cases_per_million_population / 100
    }%</td></tr>
    `;
    dataTable.innerHTML = tData;
    countryStatsDiv.innerHTML = "";
    countryStatsDiv.appendChild(dataTable);
    countryStatsDiv.scrollIntoView();
  } catch {
    console.log("cant find country, try different");
  }
}
