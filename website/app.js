/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?&units=imperial";
const apiKey = "&appid={YOUR_APP_Key}";
const postWeatherEntryUrl = "/addWeatherEntry";
const getRecentWeatherEntryUrl = "/getRecentWeatherEntry";
const zipCodeQuery = "&zip={code},us";

/* Function called by event listener */
/* Function to GET Web API Data*/
const getWeatherData = async (e) => {
  if (!validateData()) {
    return;
  }
  const zipCode = document.querySelector("#zip").value;
  const apiUrlWithParamters =
    apiUrl + zipCodeQuery.replace("{code}", zipCode) + apiKey;
  await fetch(apiUrlWithParamters)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Invalid zip code");
    })
    .then(postWeatherDataEntry)
    .then(getRecentWeatherEntry)
    .catch(handleError);
};

/* Function to POST data */
const postWeatherDataEntry = async (data) => {
  const feelings = document.querySelector("#feelings").value;
  const dateString = new Date().toLocaleDateString();
  await fetch(postWeatherEntryUrl, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: dateString,
      temp: parseInt(data.main.temp) + " &#8457;",
      content: feelings,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to insert the weather entry");
  });
};

/* Function to GET Project Data */
const getRecentWeatherEntry = async (data) => {
  await fetch(getRecentWeatherEntryUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch the recent entry");
      }
      return response.json();
    })
    .then((recentEntry) => {
      document.querySelector("#date").innerText = recentEntry.date;
      document.querySelector("#temp").innerHTML = recentEntry.temp;
      document.querySelector("#content").innerText = recentEntry.content;
      document.querySelector("#showResult").classList.remove("HideDiv");
      document.querySelector("#showError").classList.add("HideDiv");
    });
};

/* Function to handle the error */
const handleError = (error) => {
  document.querySelector("#showResult").classList.add("HideDiv");
  document.querySelector("#showError").classList.remove("HideDiv");
  document.querySelector("#errorMessage").innerText = error;
};

const validateData = () => {
  document.querySelector("#invalidZipCode").innerText = "";
  const zipCode = document.querySelector("#zip").value;
  const regex = /[0-9]/g;
  if (!zipCode.match(regex)) {
    document.querySelector("#invalidZipCode").innerText = "Invalid zip code";
    document.querySelector("#showResult").classList.add("HideDiv");
    return false;
  }
  return true;
};

// Event listener to add function to existing HTML DOM element
document.querySelector("#generate").addEventListener("click", getWeatherData);
