const apiKey = "aa32c4224284c535ed26dcef0dc4c83a";

const searchBtn = document.querySelector(".search-box button");
const searchInput = document.querySelector(".search-box input");

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) getWeather(city);
});

async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    updateCurrentWeather(data);
    updateHourlyForecast(data);
    updateBackground(data);

  } catch (err) {
    alert(err.message);
  }
}

function updateCurrentWeather(data) {
  const current = data.list[0];

  document.querySelector(".city").innerText = data.city.name;
  document.querySelector(".temp").innerText = `${Math.round(current.main.temp)}°C`;
  document.querySelector(".desc").innerText = current.weather[0].description;

  document.querySelector(".humidity").innerText = `${current.main.humidity}%`;
  document.querySelector(".wind").innerText = `${current.wind.speed} m/s`;
  document.querySelector(".pressure").innerText = `${current.main.pressure} hPa`;

  document.querySelector(".main-weather img").src =
    `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
}

function updateHourlyForecast(data) {
  const container = document.querySelector(".hourly-container");
  container.innerHTML = "";

  data.list.slice(0, 8).forEach(item => {
    const hour = new Date(item.dt * 1000).getHours();

    const card = document.createElement("div");
    card.className = "hour-card";

    card.innerHTML = `
      <p>${hour}:00</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
      <p>${Math.round(item.main.temp)}°</p>
    `;

    container.appendChild(card);
  });
}

function updateBackground(data) {
  const weather = data.list[0].weather[0].main.toLowerCase();
  const icon = data.list[0].weather[0].icon;
  const isNight = icon.includes("n");

  document.body.className = "";

  if (weather.includes("clear")) {
    document.body.classList.add(isNight ? "clear-night" : "clear-day");
  } else if (weather.includes("cloud")) {
    document.body.classList.add(isNight ? "clouds-night" : "clouds-day");
  } else if (weather.includes("rain")) {
    document.body.classList.add(isNight ? "rain-night" : "rain-day");
  } else {
    document.body.classList.add("clouds-day");
  }
}
