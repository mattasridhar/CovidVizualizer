import { MapCreator } from "./MapCreator.js";

const apiBaseUrl = `https://api.covid19api.com/`;
const LOG_PREFIX = `[CovidVizualizer-LOG]\n`;
const ERROR_PREFIX = `[CovidVizualizer-ERROR]\n`;
let showLogs = false;
let latitude = 78.358061; // -87.0186; //0; //
let longitude = 17.492615; // 32.4055; //0; //
let zoomType = "country";
let covidDisplayInfo = {};
let divHeight = 512;
let divWidth = 1024;
let defaultCountry = "Select your country";
let defaultCountryCode = "opt";

const renderCovidMap = (options) => {
  console.log("SRI in covidVizualizer options: ", options);
  showLogs = options.showLogs || false;
  // const documentHead = options.documentHead;
  // const covidMapArea = options.covidMapArea;
  const covidVizualizerDiv = document.getElementById("covidVizualizerDiv");
  const covidMapArea = document.getElementById("covidMapArea");
  const theme = options.theme;
  divHeight = parseInt(covidVizualizerDiv.style.height.replace("px", ""));
  divWidth = parseInt(covidVizualizerDiv.style.width.replace("px", ""));

  if (covidMapArea) {
    // console.log("SRI in covidVizualizer: ", covidMapArea.innerHTML);
    covidMapArea.innerHTML = `<div id="covidMap" style='position:relative;'></div>`;
    const mapArea = document.getElementById("covidMap");
    MapCreator(
      mapArea,
      latitude,
      longitude,
      theme,
      zoomType,
      covidDisplayInfo,
      divHeight,
      divWidth
    );

    mapArea.appendChild(createMarker(zoomType));
  } else {
    console.error(
      `${ERROR_PREFIX} <div> with ID = 'covidMapArea' missing! \nPlease create a div with id='covidVizualizerDiv' in your HTML. `
    );
  }
};

// Create a marker to show the location on map
const createMarker = (zoomType) => {
  let w = 150,
    h = 150;

  if (zoomType === "country") {
    w = 50;
    h = 50;
  }
  const redCircleDiv = document.createElement("div");
  redCircleDiv.style.width = w;
  redCircleDiv.style.height = h;
  redCircleDiv.style.backgroundColor = "#fc3535";
  redCircleDiv.style.position = "absolute";
  // redImg.style.alignItems = "center";
  redCircleDiv.style.left = divWidth / 2;
  redCircleDiv.style.top = divHeight / 2;
  redCircleDiv.style.border = `3px solid #870000`;
  redCircleDiv.style.borderRadius = "50%";
  redCircleDiv.style.opacity = "50%";

  // redCircleDiv.innerHTML = `<h3 style='color:#570000'> SRI </h3>`;
  return redCircleDiv;
};

// Get the list of countries and their co-ordinates

// Get all country Names for which we have Covid information
const getCountriesInfo = async () => {
  console.log("SRI in npm.getCountriesInfo");
  const apiCountriesURL = `${apiBaseUrl}countries`;
  const countriesListSelect = document.getElementById("countriesList");
  if (countriesListSelect) {
    countriesListSelect.style.margin = 10;
    countriesListSelect.style.padding = 5;
    const option = document.createElement("option");
    option.value = defaultCountry.trim();
    option.id = defaultCountryCode;
    option.text = defaultCountry.trim();
    option.selected = true;
    countriesListSelect.appendChild(option);
    let error = "";
    let status = "failure";
    await fetch(apiCountriesURL)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((entry) => {
          const option = document.createElement("option");
          option.value = entry.Country.trim();
          option.id = entry.Slug;
          option.text = entry.Country.trim();
          countriesListSelect.appendChild(option);
        });
        status = "success";
        error = "";
        return { status, error };
      })
      .catch((err) => {
        console.error(`${ERROR_PREFIX} Error While fetching Countries List`);
        error = err;
        status = "failure";
        return { status, error };
      });
    return { status, error };
  } else {
    console.error(
      `${ERROR_PREFIX} <select> with ID = 'countriesList' missing! \nPlease create a <select> with id='countriesList' within <div id=covidVizualizerDiv> in your HTML. `
    );
  }
};

export default { renderCovidMap, getCountriesInfo };
