<template>
  <div>
    <l-map :center="center" :min-zoom="16" :zoom="18" @update:center="move">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>

      <l-marker
        v-for="cluster in toilets"
        :lat-lng="cluster.location"
        :icon="icon"
      ></l-marker>

      <l-circle-marker :lat-lng="location"></l-circle-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircleMarker, LMarker } from "vue2-leaflet";
import { icon as LeafletIcon } from "leaflet";
import markerUrl from "./icons/marker.svg";

const icon = LeafletIcon({
  // TODO: Find a better icon, maybe use different icons based on what toilets
  //       are available
  iconUrl: markerUrl,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

export default {
  name: "ToiletMap",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircleMarker,
  },

  props: ["location", "toilets"],

  created() {
    this.center = this.location;
    this.icon = icon;
  },

  methods: {
    move(center) {
      history.replaceState(
        null,
        "NUS Business",
        `map?lat=${center.lat}&lng=${center.lng}`
      );
    },
  },
};
</script>

<style scoped></style>
