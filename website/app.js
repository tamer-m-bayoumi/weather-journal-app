/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "&appid=f41ba07833ed8d0b19ed85241f73b85e";
const postWeatherEntryUrl = "/addWeatherEntry";
const getRecentWeatherEntryUrl = "/getRecentWeatherEntry";
const zipCodeQuery = "&zip={code},us";

/* Function called by event listener */
/* Function to GET Web API Data*/
const getWeatherData = async (e) => {
  const zipCode = document.querySelector("#zip").value;
  const apiUrlWithParamters =
    apiUrl + zipCodeQuery.replace("{code}", zipCode) + apiKey;
  await fetch(apiUrlWithParamters)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("invalid zip code");
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

// Event listener to add function to existing HTML DOM element
document.querySelector("#generate").addEventListener("click", getWeatherData);
