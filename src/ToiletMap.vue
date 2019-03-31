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

      <l-polyline
        v-if="highlightToilet"
        :key="'highlight-line-' + highlightToilet.id"
        :lat-lngs="[location, highlightToilet.location]"
      >
        <l-tooltip :options="tooltipOptions">{{
          distance(location, highlightToilet.location)
        }}</l-tooltip>
      </l-polyline>

      <l-polyline
        v-if="selectedToilet"
        class-name="selected-distance"
        :key="'selected-line-' + selectedToilet.id"
        :lat-lngs="[location, selectedToilet.location]"
      >
        <l-tooltip :options="tooltipOptions">{{
          distance(location, selectedToilet.location)
        }}</l-tooltip>
      </l-polyline>

      <l-marker
        v-for="cluster in toilets"
        :lat-lng="cluster.location"
        :key="'marker-' + cluster.id"
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
        @click="selectToilet($event, cluster.id)"
      >
        <l-icon :icon-size="iconSize" :class-name="markerClassName(cluster.id)">
          <img :src="markerUrl" alt="Toilet" />
          <toilet-index
            v-show="cluster.id in shownToiletIds"
            class="toilet-index"
            :index="shownToiletIds[cluster.id]"
          ></toilet-index>
        </l-icon>
      </l-marker>

      <l-circle-marker
        class-name="location-marker"
        :lat-lng="location"
        :radius="5"
        :fillOpacity="1"
      ></l-circle-marker>
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
import ToiletIndex from "./ToiletIndex";
import markerUrl from "./icons/toilet.svg";
import { distance, renderDistance } from "./utils";

const iconSize = [24, 24];
const tooltipOptions = {
  permanent: true,
  direction: "top",
  offset: [0, -5],
};

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
    ToiletIndex,
  },

  props: [
    "location",
    "center",
    "toilets",
    "shown-toilets",
    "highlight-toilet",
    "selected-toilet",
  ],

  created() {
    this.markerUrl = markerUrl;
    this.iconSize = iconSize;
    this.tooltipOptions = tooltipOptions;
  },

  computed: {
    shownToiletIds() {
      const idMap = {};
      this.shownToilets.forEach(
        (cluster, index) => (idMap[cluster.id] = index + 1)
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

    selectToilet(event, index) {
      event.originalEvent.preventDefault();
      this.$emit("update:selected-toilet", index);
    },

    distance(fromLatLng, toLatLng) {
      return renderDistance(distance(fromLatLng, toLatLng));
    },

    markerClassName(id) {
      return classnames("toilet-marker", {
        shown: id in this.shownToiletIds,
        selected: this.selectedToilet && this.selectedToilet.id === id,
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

  &.selected .toilet-index {
    background: $nus-orange;
  }

  img {
    display: block;
    width: 100%;
  }
}

.selected-distance {
  stroke: $nus-orange;
}

.location-marker {
  animation: glow 3s infinite;
}

@keyframes glow {
  from {
    stroke-width: 0;
    stroke-opacity: 0.8;
  }

  to {
    stroke-width: 20px;
    stroke-opacity: 0;
  }
}
</style>
