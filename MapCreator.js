import { Marker } from "./Marker.js";

const mapboxToken =
  "pk.eyJ1IjoibWF0dGFzcmlkaGFyIiwiYSI6ImNrZ2xlMDN1ODBrMDAyenBudmplaXJ1Z2cifQ.R0uCCAssUlmmlnGcoocMfQ";

// Create the world map
export const MapCreator = (
  mapArea,
  latitude = 0,
  longitude = 0,
  theme = "light",
  zoomType,
  covidDisplayInfo,
  divHeight,
  divWidth
) => {
  // console.log("SRI in mapCreator: ", mapArea.innerHTML);

  let zoomLevel = 0;
  let themeStyle = "light-v10";
  if (zoomType === "country") {
    zoomLevel = 1; // 11.5;
  } else if (zoomType === "province") {
    zoomLevel = 4; //
  }

  //SRI to remove this later
  latitude === 0 ? (zoomLevel = 1) : (zoomLevel = 4);

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
    divWidth
  );
};

// Get the world map using mapbox API
const getMap = async (
  mapArea,
  latitude,
  longitude,
  zoomLevel,
  themeStyle,
  divHeight,
  divWidth
) => {
  /* console.log(
    "SRI in mapCreator: ",
    mapArea.innerHTML,
    // " latitude",
    // latitude,
    // " longitude",
    // longitude,
    " zoomLevel",
    zoomLevel,
    " themeStyle",
    themeStyle,
    " divHeight",
    divHeight,
    " divWidth",
    divWidth
  ); */
  const { x, y } = getWebMercatorCords(latitude, longitude, zoomLevel);
  console.log("SRI x: ", x, " y: ", y);
  const apiMapImgURL = `https://api.mapbox.com/styles/v1/mapbox/${themeStyle}/static/${latitude},${longitude},${zoomLevel}/${divWidth}x${divHeight}?access_token=${mapboxToken}`;

  // mapArea.appendChild(`<img src=${apiMapImgURL}></img>`);
  // mapArea.appendChild(
  //   `<div id="redGif" style='width:50px; height:50px background:red;'></div>`
  // );
  const mapImg = document.createElement("img");
  mapImg.src = apiMapImgURL;
  mapImg.style.position = "relative";

  mapArea.appendChild(mapImg);
};

// Convert latitude and longitude values to 2d points
const getWebMercatorCords = (latitude, longitude, zoomLevel) => {
  console.log("SRI getMerc: ", " latitude", latitude, " longitude", longitude);
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
