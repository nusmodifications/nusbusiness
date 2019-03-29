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
        v-for="(cluster, index) in toilets"
        :lat-lng="cluster.location"
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
        @click="$event.originalEvent.preventDefault()"
      >
        <l-icon :icon-size="[24, 24]" :class-name="markerClassName(cluster.id)">
          <img :src="markerUrl" alt="Toilet" />
          <span v-if="shownToiletIds.has(cluster.id)" class="toilet-index">{{
            shownToiletIds.get(cluster.id)
          }}</span>
        </l-icon>
      </l-marker>

      <l-circle-marker
        :lat-lng="location"
        :stroke="false"
        :radius="5"
        :fillOpacity="1"
      ></l-circle-marker>

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
import markerUrl from "./icons/toilet.svg";
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

  props: ["location", "center", "toilets", "shown-toilets", "highlight-toilet"],

  created() {
    // TODO: Find a better icon, maybe use different icons based on what toilets
    this.markerUrl = markerUrl;
  },

  computed: {
    highlightCluster() {
      return this.toilets.find(cluster => cluster.id === this.highlightToilet);
    },

    shownToiletIds() {
      const idMap = new Map();
      this.shownToilets.forEach((cluster, index) =>
        idMap.set(cluster.id, index + 1)
      );
      return idMap;
    },
  },

  methods: {
    move(center) {
      history.replaceState(
        null,
        "NUS Business",
        `map?lat=${center.lat}&lng=${center.lng}`
      );

      this.$emit("update:center", center);
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
@import "./variables";

.toilet-marker {
  opacity: 0.5;
  transition: opacity 0.5s;
  text-align: center;

  &.shown {
    opacity: 1;
  }

  img {
    display: block;
    width: 100%;
  }
}

.toilet-index {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  margin-top: 0.2rem;
  border-radius: 50%;
  line-height: 1.9rem;
  color: #fff;
  font-weight: bold;
  background: $theme-primary;
}
</style>
