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

    <app-bar class="header app-bar hide-when-horizontal">
      <button
        type="button"
        class="locate-button"
        @click.prevent="getLocation"
        :disabled="isSearching"
      >
        <img
          v-if="isSearching"
          :src="spinnerIconUrl"
          class="spinner white-svg"
          alt="Hold onto your butts..."
        />
        <img
          v-else
          :src="navigationIconUrl"
          class="white-svg"
          alt="Locate me"
        />
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
        <div class="header">
          <app-bar class="app-bar hide-when-vertical">
            <button
              type="button"
              class="locate-button"
              @click.prevent="getLocation"
              :disabled="isSearching"
            >
              <img
                v-if="isSearching"
                :src="spinnerIconUrl"
                class="spinner white-svg"
                alt="Hold your butts..."
              />
              <img
                v-else
                :src="navigationIconUrl"
                class="white-svg"
                alt="Locate me"
              />
            </button>
          </app-bar>
        </div>
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

import navigationIconUrl from "./icons/navigation.svg";
import spinnerIconUrl from "./icons/spinner.svg";

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
        this.center = this.selectedToilet.location;
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
    this.navigationIconUrl = navigationIconUrl;
    this.spinnerIconUrl = spinnerIconUrl;
  },

  methods: {
    closeOverlay() {
      this.showOverlay = false;
    },

    locationUpdated(newLocation) {
      this.location = newLocation;
    },

    getLocation() {
      this.isSearching = true;

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          this.locationUpdated(location);
          this.center = location; // Pan map to current location

          this.showOverlay = false;
          this.isSearching = false;
        },
        error => {
          console.error("KENA ERROR finding them", error);
          alert(
            "Cannot find you. Did you remember to give us permission to use your location?"
          );
          this.isSearching = false;
        }
      );
    },

    track() {
      if (this.$ga) {
        this.$ga.page({
          page: window.location.pathname,
          location: window.location.href,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./variables";
@import "./trig";

html,
body {
  height: 100%;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

.app-container {
  height: 100%;

  // Header wrapper necessary due to weird bug on Safari/Chrome on iOS and macOS.
  .header {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 5000; // Raise above map
  }

  .app-bar {
    display: flex;
    align-items: center;
  }

  .locate-button {
    display: flex;
    height: auto;
    padding: 1rem;
    margin: 0 0 0 auto;

    img {
      height: 2rem;
      padding: 0;
    }

    .spinner {
      $square-padding: 0.2676rem;
      padding-bottom: $square-padding; // By trial and error. Try to make the image a square
      margin-bottom: -$square-padding; // Prevent image from changing height of parent element

      animation: rotation 0.5s infinite linear;
    }
  }

  @media only screen and (max-width: $tablet-width - 1) {
    display: flex;
    flex-direction: column;

    .hide-when-vertical {
      display: none;
    }

    .map-wrapper {
      flex: 1;
      height: 60vh;
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
