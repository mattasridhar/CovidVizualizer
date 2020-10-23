const apiBaseUrl = `https://api.covid19api.com/`;
let defaultCountry = "Select your country";
let defaultCountryCode = "opt";
let defaultProvince = "Select your province";
let defaultProvinceCode = "opt";

// Get all Covid information for the given country
export const fetchCovidInfo = async (
  selectedCountry,
  LOG_PREFIX,
  ERROR_PREFIX,
  showLogs
) => {
  let latArray = [];
  let longArray = [];
  let totalConfirmed = 0;
  let totalRecovered = 0;
  let totalDeaths = 0;
  /* Structure:
  covidDisplayInfo = {
        countryInfo: {
            countryName: 'Countryname',
            covidStatusInfo: {
                confirmed: 0,
                recovered: 0,
                deaths: 0
            },
            latitude: 0.0,
            longitude: 0.0
        },
        provinceInfo: [
            {
                provinceName: 'Provincename',
                covidStatusInfo: {
                    confirmed: 0,
                    recovered: 0,
                    deaths: 0
                  },
                  latitude: 0.0,
                  longitude: 0.0
            }
        ]
    } */
  let covidStatusInfo = {
    confirmed: 0,
    recovered: 0,
    deaths: 0,
  };
  let countryInfo = {
    countryName: "",
    countryCode: "",
    covidStatusInfo: {},
    latitude: 0.0,
    longitude: 0.0,
  };
  let provinceInfo = {
    provinceName: "",
    covidStatusInfo: {},
    latitude: 0.0,
    longitude: 0.0,
  };
  let provinceInfoArr = [];
  let covidDisplayInfo = {
    countryCovidInfo: {},
    provinceCovidInfo: [],
  };
  let error = "";
  let status = "failure";
  const provincesListSelect = document.getElementById("provincesList");
  provincesListSelect.style.display = "";
  provincesListSelect.style.margin = 10;
  provincesListSelect.style.padding = 5;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const yd = String(now.getDate() - 1).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const today = `${yyyy}-${mm}-${dd}T00:00:00Z`;
  const yesterday = `${yyyy}-${mm}-${yd}T00:00:00Z`;
  const apiCovidInfoURL = `${apiBaseUrl}country/${selectedCountry.id}?from=2020-03-01T00:00:00Z&to=${today}`;

  await fetch(apiCovidInfoURL)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((entry) => {
        // Store the latest covid Data
        if (entry.Date === yesterday) {
          countryInfo.countryName = entry.Country;
          countryInfo.countryCode = entry.CountryCode;
          if (entry.Province !== "") {
            provinceInfoArr.push({
              provinceName: entry.Province,
              latitude: entry.Lat,
              longitude: entry.Lon,
              covidStatusInfo: {
                confirmed: entry.Confirmed,
                recovered: entry.Recovered,
                deaths: entry.Deaths,
              },
            });

            // populatng the provinces dropdown
            if (provincesListSelect) {
              const option = document.createElement("option");
              option.value = entry.Province.trim();
              option.id = entry.Province;
              option.text = entry.Province.trim();
              provincesListSelect.appendChild(option);
            }
          }
          totalConfirmed += entry.Confirmed;
          totalRecovered += entry.Recovered;
          totalDeaths += entry.Deaths;
          latArray.push(entry.Lat);
          longArray.push(entry.Lon);
        }
      });

      const minLat = Math.min(...latArray);
      const maxLat = Math.max(...latArray);
      const minLong = Math.min(...longArray);
      const maxLong = Math.max(...longArray);

      countryInfo.latitude = (minLat + maxLat) / 2;
      countryInfo.longitude = (minLong + maxLong) / 2;
      covidStatusInfo.confirmed = totalConfirmed;
      covidStatusInfo.recovered = totalRecovered;
      covidStatusInfo.deaths = totalDeaths;
      countryInfo.covidStatusInfo = covidStatusInfo;

      covidDisplayInfo.countryCovidInfo = countryInfo;
      covidDisplayInfo.provinceCovidInfo = provinceInfoArr;

      // set default province in dropdown else hide if no provinces are available
      if (provincesListSelect && provinceInfoArr.length > 0) {
        const option = document.createElement("option");
        option.value = defaultProvince.trim();
        option.id = defaultProvinceCode;
        option.text = defaultProvince.trim();
        option.selected = true;
        provincesListSelect.appendChild(option);
      } else {
        provincesListSelect.style.display = "none";
      }

      showLogs
        ? console.log(
            `${LOG_PREFIX} Successfully completed fetching Covid-19 information. `,
            covidDisplayInfo
          )
        : "";

      status = "success";
      error = "";
      return { status, error, covidDisplayInfo };
    })
    .catch((err) => {
      console.log(
        `${ERROR_PREFIX} Error occured while fetching Covid Data: `,
        err
      );
      error = err;
      status = "failure";
      return { status, error };
    });
  return { status, error, covidDisplayInfo };
};

// Get all country Names for which we have Covid information
export const fetchCountriesData = async (
  LOG_PREFIX,
  ERROR_PREFIX,
  showLogs
) => {
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

        showLogs
          ? console.log(
              `${LOG_PREFIX} Successfully completed fetching List of Countries. `
            )
          : "";

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
