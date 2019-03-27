import "normalize.css";
import "leaflet/dist/leaflet.css";

import "./styles.scss";

import ToiletMap from "./map/map";

const map = new ToiletMap("map", "list");

document.getElementById("locate").addEventListener("click", evt => {
  evt.preventDefault();

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;

    history.pushState(
      null,
      "NUS Business",
      `map?lat=${latitude}&lng=${longitude}`
    );

    // Fade out overlay
    const overlay = document.querySelector(".intro-overlay");
    overlay.classList.add("fade");
    setTimeout(() => {
      overlay.classList.add("hide");
    }, 300);

    // Pan map to current location
    map.setLocation(latitude, longitude);
  });
});
