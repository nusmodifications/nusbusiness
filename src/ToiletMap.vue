<template>
  <div>
    <l-map
      :center="center"
      :min-zoom="16"
      :zoom="18"
      @update:center="move"
      @click="onMapClick"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>

      <l-marker
        v-for="cluster in toilets"
        :lat-lng="cluster.location"
        :icon="icon"
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
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

  props: ["location", "toilets", "highlight-toilet"],

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

    onMapClick(evt) {
      const { lat, lng } = evt.latlng;
      this.$emit("update:location", [lat, lng]);
    },

    hoverToilet(index) {
      this.$emit("update:highlight-toilet", index);
    },

    clickToilet(index) {
      this.$emit("toilet:click", index);
    },
  },
};
</script>

<style scoped></style>
