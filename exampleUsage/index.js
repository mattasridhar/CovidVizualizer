import covidvizualizer from "covidvizualizer";

const theme = "light";
const showLogs = true;
let covidInformation = {};

const mapHandler = () => {
  getCountriesList();
};

// Fetch the list of countries
const getCountriesList = async () => {
  await covidvizualizer.getCountriesInfo({ showLogs }).then((response) => {
    if (response.status === "success") {
      // Listening to selection in Countries dropdown
      const countriesListSelect = document.getElementById("countriesList");
      const provincesListSelect = document.getElementById("provincesList");
      countriesListSelect.addEventListener("change", () => {
        const selectedCountry =
          countriesListSelect.options[countriesListSelect.selectedIndex];
        const zoomType = "country";
        // Fetch Covid Information for the selected country
        covidvizualizer
          .getCovidInfo({ selectedCountry, showLogs })
          .then((covidData) => {
            covidInformation = covidData;
            // Plot and render the information on Map
            covidvizualizer.renderCovidMap({
              zoomType,
              showLogs,
              theme,
              covidDisplayInfo: covidData.covidDisplayInfo.countryCovidInfo,
            });
          });
      });

      // Listening to selection in Provinces dropdown
      provincesListSelect.addEventListener("change", () => {
        if (covidInformation.covidDisplayInfo) {
          const selectedProvince =
            provincesListSelect.options[provincesListSelect.selectedIndex].id;
          covidInformation.covidDisplayInfo.provinceCovidInfo.forEach(
            (entry) => {
              if (selectedProvince === entry.provinceName) {
                const zoomType = "province";
                // Plot and render the information on Map
                covidvizualizer.renderCovidMap({
                  zoomType,
                  showLogs,
                  theme,
                  covidDisplayInfo: entry,
                });
              }
            }
          );
        }
      });
    } else {
      console.log(
        "Failed to get countried information due to ERROR: ",
        response.error
      );
    }
  });
};

document.addEventListener("DOMContentLoaded", mapHandler);
