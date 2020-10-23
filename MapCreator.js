const mapboxToken =
  "pk.eyJ1IjoibWF0dGFzcmlkaGFyIiwiYSI6ImNrZ2xlMDN1ODBrMDAyenBudmplaXJ1Z2cifQ.R0uCCAssUlmmlnGcoocMfQ";

// Create the world map
export const MapCreator = (
  mapArea,
  theme = "light",
  zoomType,
  covidDisplayInfo,
  divHeight,
  divWidth
) => {
  const latitude = parseFloat(covidDisplayInfo.latitude) || 0;
  const longitude = parseFloat(covidDisplayInfo.longitude) || 0;
  const covidInfoArea = document.getElementById("covidInfo");

  let zoomLevel = 0;
  let themeStyle = "light-v10";
  if (zoomType === "country") {
    zoomLevel = 2.5;
  } else if (zoomType === "province") {
    zoomLevel = 5;
  }

  if (theme === "dark") {
    themeStyle = "dark-v10";
  }
  getMap(
    mapArea,
    latitude,
    longitude,
    zoomLevel,
    themeStyle,
    divHeight,
    divWidth,
    zoomType
  );

  if (covidInfoArea) {
    covidInfoArea.innerHTML = `<u><b> COVID-19</b> Status: </u><br><br> <i>&nbsp;&nbsp;Confirmed:</i> ${covidDisplayInfo.covidStatusInfo.confirmed} <br> <i>&nbsp;&nbsp;Recovered:</i> ${covidDisplayInfo.covidStatusInfo.recovered} <br> <i>&nbsp;&nbsp;Deaths:</i> ${covidDisplayInfo.covidStatusInfo.deaths}`;
  } else {
    console.error(
      `${ERROR_PREFIX} <div> with ID = 'covidInfo' missing! \nPlease create a div within id='covidVizualizerDiv' in your HTML. `
    );
  }
};

// Get the world map using mapbox API
const getMap = async (
  mapArea,
  latitude,
  longitude,
  zoomLevel,
  themeStyle,
  divHeight,
  divWidth,
  zoomType
) => {
  /* // Can use these to properly place the Markers on Map
  const { x, y } = getWebMercatorCords(latitude, longitude, zoomLevel); */
  const apiMapImgURL = `https://api.mapbox.com/styles/v1/mapbox/${themeStyle}/static/${longitude},${latitude},${zoomLevel}/${divWidth}x${divHeight}?access_token=${mapboxToken}`;

  const mapImg = document.createElement("img");
  mapImg.src = apiMapImgURL;
  mapImg.style.position = "relative";

  mapArea.appendChild(mapImg);
};

// Convert latitude and longitude values to 2d points
const getWebMercatorCords = (latitude, longitude, zoomLevel) => {
  let x = 0,
    y = 0;

  // using Formula from 'https://en.wikipedia.org/wiki/Web_Mercator_projection'
  const prefixConstant = (256 / Math.PI) * Math.pow(2, zoomLevel);
  const longSuffix = convertToRadians(longitude) + Math.PI;
  const tanConstant = Math.tan(Math.PI / 4 + convertToRadians(latitude) / 2);
  const latSuffix = Math.PI - Math.log(tanConstant);

  x = prefixConstant * longSuffix;
  y = prefixConstant * latSuffix;

  return { x, y };
};

const convertToRadians = (value) => {
  return parseInt(value) * (Math.PI / 180);
};
