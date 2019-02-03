import "normalize.css";
import "leaflet/dist/leaflet.css";

import * as L from "leaflet";
import Flatbush from 'flatbush';

import toilets from './toilets.json';
import "./styles.scss"

// Create index for searching
const toiletIndex = new Flatbush(toilets.length);
toilets.forEach(toilet => {
  const [y, x] = toilet.location;
  toiletIndex.add(x, y);
});
toiletIndex.finish();

const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get('lat'));
const lng = parseFloat(params.get('lng'));

const map = L.map('map', {
  center: [lat, lng],
  zoom: 18,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// const markers = [];
// toilets.forEach(toilet => {
//   if (!toilet.location) return;
//
//   const marker = L.Marker(toilet.location)
//     .addTo(map);
//
//   markers.push(marker);
// });

const nearestToilets = toiletIndex
  .neighbors(lng, lat, 20)
  .map(index => toilets[index]);

console.log(nearestToilets);
map.flyTo(nearestToilets[0].location);

L.marker(nearestToilets[0].location).addTo(map);
