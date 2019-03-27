<template>
  <div>
    <overlay v-if="showOverlay" @location="locationUpdated"></overlay>

    <toilet-map
      class="map"
      :location="location"
      :toilets="toilets"
    ></toilet-map>

    <sidebar class="sidebar" :location="location" :toilets="sortedToilets" />
  </div>
</template>

<script>
import ToiletMap from "./ToiletMap";
import Sidebar from "./Sidebar";
import Overlay from "./Overlay";
import clusters from "./clusters";

const NEAREST_RESULTS = 10;

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

      // Map related state
      location: [lat, lng],
      toilets: clusters.toilets,
      toiletIndex: clusters.index,
    };
  },

  computed: {
    sortedToilets() {
      const [lat, lng] = this.location;
      return this.toiletIndex
        .neighbors(lat, lng)
        .map(index => this.toilets[index]);
    },
  },

  methods: {
    locationUpdated(newLocation) {
      this.location = newLocation;
      this.showOverlay = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$sidebar-width: 20rem;

.map,
.sidebar {
  position: absolute;
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
</style>
