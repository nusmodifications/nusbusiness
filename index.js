import "normalize.css";

document.getElementById("locate")
  .addEventListener('click', (evt) => {
    evt.preventDefault();

    navigator.geolocation.getCurrentPosition(function (position) {
      window.location = `map?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
    });
  });
