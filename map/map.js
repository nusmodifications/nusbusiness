import * as L from "leaflet";
import Flatbush from "flatbush";

import markerUrl from "./icons/marker.svg";
import clusters from "./clusters.json";

// Get the starting location from params. If not provided, use Central Library's location
const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get("lat")) || 1.2966113;
const lng = parseFloat(params.get("lng")) || 103.7732264;

const icon = L.icon({
  // TODO: Find a better icon, maybe use different icons based on what toilets
  //       are available
  iconUrl: markerUrl,
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

// TODO: Highlight nearest n toilet
// TODO: Build UI to display toilet info
// TODO: Allow filtering by gender / type (staff, handicap)

export default class ToiletMap {
  markers = [];

  index = (() => {
    const index = new Flatbush(clusters.length);
    clusters.forEach(toilet => {
      const [y, x] = toilet.location;
      index.add(x, y, x, y);
    });
    index.finish();
    return index;
  })();

  location = [lat, lng];

  constructor(mapId, listId) {
    // Initialize list used for displaying nearby toilets
    this.list = document.getElementById(listId);

    // Initialize the map
    // TODO: Don't let the user pan outside the school
    this.map = L.map(mapId, {
      center: this.location,
      zoom: 18
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add all of the toilets
    this.markers = clusters.map(cluster =>
      L.marker(cluster.location, { icon }).addTo(this.map)
    );
  }

  setLocation = (lat, lng) => {
    this.location = [lat, lng];

    // Update current location marker
    if (!this.locationMarker)
      this.locationMarker = L.circleMarker(this.location).addTo(this.map);
    this.locationMarker.setLatLng(this.location);

    // Update results

    this.panToNearestToilet(lat, lng);
  };

  panToNearestToilet = (lat, lng) => {
    const nearestToilets = this.index
      .neighbors(lng, lat, 5)
      .map(index => clusters[index]);

    this.map.panTo(nearestToilets[0].location);
  };
}
