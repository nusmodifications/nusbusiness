<template>
  <div class="app-container">
    <transition name="fade">
      <overlay
        v-if="showOverlay"
        @location="locationUpdated"
        @close="closeOverlay"
        @locate="getLocation"
        @toilet:click="onToiletClick"
      ></overlay>
    </transition>

    <app-bar class="header hide-when-horizontal">
      <button
        type="button"
        class="button-primary"
        @click.prevent="getLocation"
        :disabled="isSearching"
      >
        {{ isSearching ? "Hold on to your butts..." : "Find my ass" }}
      </button>
    </app-bar>

    <div class="map-wrapper">
      <toilet-map
        class="map"
        :toilets="toilets"
        :shown-toilets="sortedToilets"
        :location.sync="location"
        :center.sync="center"
        :highlight-toilet.sync="hoverToilet"
        :selected-toilet.sync="selectedToilet"
      ></toilet-map>
    </div>

    <sidebar
      class="sidebar"
      :location="location"
      :toilets="sortedToilets"
      :highlight-toilet.sync="hoverToilet"
      :selected-toilet.sync="selectedToilet"
      @show-more="shownItems += 5"
    >
      <template v-slot:header>
        <app-bar class="header hide-when-vertical">
          <button
            type="button"
            class="button-primary"
            @click.prevent="getLocation"
            :disabled="isSearching"
          >
            {{ isSearching ? "Hold on to your butts..." : "Find my ass" }}
          </button>
        </app-bar>
      </template>
    </sidebar>
  </div>
</template>

<script>
import AppBar from "./AppBar";
import Overlay from "./Overlay";
import ToiletMap from "./ToiletMap";
import Sidebar from "./Sidebar";
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
    AppBar,
    ToiletMap,
    Sidebar,
  },

  data() {
    // Don't show overlay when the user has passed in coords
    const showOverlay = window.location.pathname !== "/map";
    return {
      showOverlay,
      isSearching: false,

      // Toilet state
      hoverToiletId: null,
      selectedToiletId: null,
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

    selectedToilet: {
      get() {
        if (this.selectedToiletId == null) return null;
        return this.toilets.find(
          cluster => cluster.id === this.selectedToiletId
        );
      },

      set(id) {
        this.selectedToiletId = id;
      },
    },

    hoverToilet: {
      get() {
        if (this.hoverToiletId == null) return null;
        return this.toilets.find(cluster => cluster.id === this.hoverToiletId);
      },

      set(id) {
        this.hoverToiletId = id;
      },
    },
  },

  watch: {
    location(newLocation) {
      const [lat, lng] = newLocation;
      history.replaceState(null, "NUS Business", `map?lat=${lat}&lng=${lng}`);
      this.track();
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

    getLocation() {
      this.isSearching = true;

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          this.locationUpdated(location);
          this.center = location; // Pan map to current location
          this.isSearching = false;
        },
        error => {
          console.error("KENA ERROR finding them", error);
          alert("Cannot find you. Did you block us?");
          this.isSearching = false;
        }
      );
    },

    track() {
      this.$ga.page({
        page: window.location.pathname,
        location: window.location.href,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./variables";

html,
body {
  height: 100%;
}

.app-container {
  height: 100%;

  .header {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 5000; // Raise above map
  }

  @media only screen and (max-width: $tablet-width - 1) {
    display: flex;
    flex-direction: column;

    .hide-when-vertical {
      display: none;
    }

    .map-wrapper {
      flex: 1;
      min-height: 60vh;
    }

    .map {
      height: 100%;
    }
  }

  @media only screen and (min-width: $tablet-width) {
    .hide-when-horizontal {
      display: none;
    }

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
  }
}
</style>
