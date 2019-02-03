import "../node_modules/normalize.css/normalize.css";
import "leaflet/dist/leaflet.css";

import * as L from "leaflet";
import Flatbush from 'flatbush';

import clusters from './clusters.json';
import markerUrl from './icons/marker.svg';
import "../styles.scss";

// Create index for searching
const toiletIndex = new Flatbush(clusters.length);
clusters.forEach(toilet => {
  const [y, x] = toilet.location;
  toiletIndex.add(x, y, x, y);
});
toiletIndex.finish();

// Get the starting location from params
// TODO: Add a sensible default latlng
const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get('lat'));
const lng = parseFloat(params.get('lng'));

// Initialize the map
// TODO: Don't let the user pan outside the school
const map = L.map('map', {
  center: [lat, lng],
  zoom: 18,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const nearestToilets = toiletIndex
  .neighbors(lng, lat, 5)
  .map(index => toilets[index]);

map.panTo(nearestToilets[0].location);

// Add all of the toilets
const markers = [];
const icon = L.icon({
  // TODO: Find a better icon, maybe use different icons based on what toilets
  //       are available
  iconUrl: markerUrl,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

clusters.forEach(cluster => {
  const marker = L.marker(cluster.location, { icon }).addTo(map);
  markers.push(marker);
});

// TODO: Highlight nearest n toilet
// TODO: Build UI to display toilet info
// TODO: Allow filtering by gender / type (staff, handicap)
