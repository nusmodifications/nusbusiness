import * as L from "leaflet";
import Flatbush from "flatbush";

import clusters from "./clusters.json";
import markerUrl from "./icons/marker.svg";

// Get the starting location from params
// TODO: Add a sensible default latlng
const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get('lat'));
const lng = parseFloat(params.get('lng'));

// TODO: Highlight nearest n toilet
// TODO: Build UI to display toilet info
// TODO: Allow filtering by gender / type (staff, handicap)

export default class ToiletMap {
  constructor(id) {
    // Initialize the map
    // TODO: Don't let the user pan outside the school
    this.map = L.map(id, {
      center: [lat, lng],
      zoom: 18
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Create spatial index for searching
    this.index = new Flatbush(clusters.length);
    clusters.forEach(toilet => {
      const [y, x] = toilet.location;
      this.index.add(x, y, x, y);
    });
    this.index.finish();

    // Add all of the toilets
    this.markers = [];
    const icon = L.icon({
      // TODO: Find a better icon, maybe use different icons based on what toilets
      //       are available
      iconUrl: markerUrl,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    clusters.forEach(cluster => {
      const marker = L.marker(cluster.location, { icon }).addTo(map);
      this.markers.push(marker);
    });
  }

  panToNearestToilet = (lat, lng) => {
    const nearestToilets = this.index
      .neighbors(lng, lat, 5)
      .map(index => clusters[index]);

    this.map.panTo(nearestToilets[0].location);
  };
}
