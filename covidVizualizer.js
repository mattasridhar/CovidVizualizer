import { MapCreator } from "./MapCreator.js";
import { fetchCountriesData, fetchCovidInfo } from "./fetchData.js";

const LOG_PREFIX = `[CovidVizualizer-LOG]\n`;
const ERROR_PREFIX = `[CovidVizualizer-ERROR]\n`;
let showLogs = false;
let zoomType = "country";
let covidDisplayInfo = {};
let divHeight = 512;
let divWidth = 1024;

const renderCovidMap = (options) => {
  showLogs = options.showLogs || false;
  const covidVizualizerDiv = document.getElementById("covidVizualizerDiv");
  const covidMapArea = document.getElementById("covidMapArea");
  const theme = options.theme;
  covidDisplayInfo = options.covidDisplayInfo;
  zoomType = options.zoomType;
  divHeight = parseInt(covidVizualizerDiv.style.height.replace("px", ""));
  divWidth = parseInt(covidVizualizerDiv.style.width.replace("px", ""));

  if (covidMapArea) {
    covidMapArea.innerHTML = `<div id="covidMap" style='position:relative;'></div>`;
    const mapArea = document.getElementById("covidMap");
    MapCreator(mapArea, theme, zoomType, covidDisplayInfo, divHeight, divWidth);

    mapArea.appendChild(createMarker(zoomType));

    showLogs
      ? console.log(
          `${LOG_PREFIX} Rendering of Covid-19 information on UI completed. `
        )
      : "";
  } else {
    console.error(
      `${ERROR_PREFIX} <div> with ID = 'covidMapArea' missing! \nPlease create a div within id='covidVizualizerDiv' in your HTML. `
    );
  }
};

// Create a marker to show the location on map
const createMarker = (zoomType) => {
  let w = 250,
    h = 250;
  let leftDivider = 3.5,
    topDivider = 3.5;

  if (zoomType === "country") {
    w = 150;
    h = 150;
    leftDivider = 2.5;
    topDivider = 2.5;
  }
  const redCircleDiv = document.createElement("div");
  redCircleDiv.style.width = w;
  redCircleDiv.style.height = h;
  redCircleDiv.style.backgroundColor = "#fc3535";
  redCircleDiv.style.position = "absolute";
  redCircleDiv.style.left = `${divWidth / leftDivider}px`;
  redCircleDiv.style.top = `${divHeight / topDivider}px`;
  redCircleDiv.style.border = `3px solid #870000`;
  redCircleDiv.style.borderRadius = "50%";
  redCircleDiv.style.opacity = "50%";

  return redCircleDiv;
};

// Get the list of countries and their co-ordinates
const getCountriesInfo = ({ showLogs }) => {
  return fetchCountriesData(LOG_PREFIX, ERROR_PREFIX, showLogs);
};

// Get the list of province and their co-ordinates. Also fetch the Covid information for the respective country
const getCovidInfo = ({ selectedCountry, showLogs }) => {
  return fetchCovidInfo(selectedCountry, LOG_PREFIX, ERROR_PREFIX, showLogs);
};

export default { renderCovidMap, getCountriesInfo, getCovidInfo };
