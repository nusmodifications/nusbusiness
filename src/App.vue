<template>
  <div>
    <transition name="fade">
      <overlay
        v-if="showOverlay"
        @location="locationUpdated"
        @close="closeOverlay"
      ></overlay>
    </transition>

    <toilet-map
      class="map"
      :location.sync="location"
      :center.sync="center"
      :toilets="toilets"
      :highlight-toilet.sync="hoverToilet"
      :shown-toilets="sortedToilets"
      @toilet:click="onToiletClick"
    ></toilet-map>

    <sidebar
      class="sidebar"
      :location="location"
      :toilets="sortedToilets"
      :highlight-toilet.sync="hoverToilet"
      @toilet:click="onToiletClick"
    />
  </div>
</template>

<script>
import ToiletMap from "./ToiletMap";
import Sidebar from "./Sidebar";
import Overlay from "./Overlay";
import clusters from "./clusters";

const DEFAULT_RESULTS_COUNT = 5;

// Get the starting location from params. If not provided, use Central Library's location
const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get("lat")) || 1.2966113;
const lng = parseFloat(params.get("lng")) || 103.7732264;

export default {
  name: "App",

  components: {
    Overlay,
    ToiletMap,
    Sidebar,
  },

  data() {
    return {
      showOverlay: true,

      // Toilet state
      hoverToilet: null,
      shownItems: DEFAULT_RESULTS_COUNT,

      // Map related state
      location: [lat, lng],
      center: [lat, lng],
    };
  },

  computed: {
    sortedToilets() {
      const [lat, lng] = this.location;
      return this.toiletIndex
        .neighbors(lng, lat)
        .map(index => this.toilets[index])
        .slice(0, this.shownItems);
    },
  },

  created() {
    this.toilets = clusters.toilets;
    this.toiletIndex = clusters.index;
  },

  methods: {
    closeOverlay() {
      this.showOverlay = false;
    },

    locationUpdated(newLocation) {
      this.location = newLocation;
    },

    onToiletHover(index) {
      this.hoverToilet = index;
    },

    onToiletClick() {},
  },
};
</script>

<style lang="scss" scoped>
@import "./skeleton";

$sidebar-width: 30rem;

.map,
.sidebar {
  position: fixed;
}

.map {
  top: 0;
  bottom: 0;
  right: 0;
  left: $sidebar-width;
}

.sidebar {
  top: 0;
  bottom: 0;
  left: 0;
  width: $sidebar-width;
}

@media only screen and (max-width: $tablet-width) {
  $bottom-bar-height: 50%;

  .map {
    top: 0;
    bottom: $bottom-bar-height;
    left: 0;
    right: 0;
    width: inherit;
  }

  .sidebar {
    top: 100% - $bottom-bar-height;
    bottom: 0;
    left: 0;
    right: 0;
    width: inherit;
  }
}
</style>
