import "normalize.css";
import "leaflet/dist/leaflet.css";

import "../styles.scss";

import ToiletMap from "./map/map"

document.getElementById("locate")
  .addEventListener('click', (evt) => {
    evt.preventDefault();

    navigator.geolocation.getCurrentPosition((position) => {
      history.pushState(null, 'NUS Business', `map?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
      // Fade out overlay
      const overlay = document.querySelector('.intro-overlay');
      overlay.classList.add('fade');
      setTimeout(() => { overlay.classList.add('hide') }, 300);
    });
  });

const map = new ToiletMap('map');
