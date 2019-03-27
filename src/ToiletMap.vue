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
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
        @click="$event.originalEvent.preventDefault()"
      >
        <l-icon
          :icon-url="markerUrl"
          :icon-anchor="[12, 24]"
          :icon-size="[24, 24]"
          :class-name="markerClassName(cluster.id)"
        ></l-icon>
      </l-marker>

      <l-circle-marker :lat-lng="location" :stroke="false"></l-circle-marker>

      <l-polyline
        v-if="highlightToilet"
        :lat-lngs="[location, highlightCluster.location]"
      >
        <l-tooltip
          :options="{ permanent: true, direction: 'top', offset: [0, -5] }"
          >{{ distance(location, highlightCluster.location) }}</l-tooltip
        >
      </l-polyline>
    </l-map>
  </div>
</template>

<script>
import classnames from "classnames";
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LMarker,
  LPolyline,
  LTooltip,
  LIcon,
} from "vue2-leaflet";
import markerUrl from "./icons/marker.svg";
import { distance, renderDistance } from "./utils";

export default {
  name: "ToiletMap",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircleMarker,
    LPolyline,
    LTooltip,
    LIcon,
  },

  props: ["location", "toilets", "shown-toilets", "highlight-toilet"],

  created() {
    this.center = this.location;
    // TODO: Find a better icon, maybe use different icons based on what toilets
    this.markerUrl = markerUrl;
  },

  computed: {
    highlightCluster() {
      return this.toilets.find(cluster => cluster.id === this.highlightToilet);
    },

    shownToiletIds() {
      return new Set(this.shownToilets.map(cluster => cluster.id));
    },
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

    distance(fromLatLng, toLatLng) {
      return renderDistance(distance(fromLatLng, toLatLng));
    },

    markerClassName(id) {
      return classnames("toilet-marker", {
        toiletMarker: true,
        shown: this.shownToiletIds.has(id),
      });
    },
  },
};
</script>

<style lang="scss">
.toilet-marker {
  opacity: 0.3;
  transition: opacity 0.5s;

  &.shown {
    opacity: 1;
  }
}
</style>
