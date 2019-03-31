<template>
  <div class="overlay unselectable">
    <div class="overlay-contents">
      <div class="title-container">
        <div class="left-pane">
          <h1 class="title">
            NUS<br />
            Business
          </h1>
        </div>
        <div class="right-pane">
          <img class="toilet" :src="markerUrl" alt="Toilet" />
        </div>
      </div>

      <p class="tagline">{{ tagline }}</p>

      <button
        type="button"
        class="button-primary"
        @click.prevent="getLocation"
        :disabled="isSearching"
      >
        {{ isSearching ? "Hold on to your butts..." : "Use my location" }}
      </button>
      <span class="or">or</span>
      <a href="/map" class="button show-map" @click.prevent="close">
        Just show me the map
      </a>
    </div>
  </div>
</template>

<script>
import markerUrl from "./icons/toilet.svg";

const TAGLINES = [
  "Catering to your business, no matter how big or small",
  "Take your business anywhere",
  "Your business is our business",
  "Find your closest business opportunity!",
  "Doing business has never been easier!",
  "Enabling your business as usual",
];

export default {
  name: "Overlay",

  created() {
    this.markerUrl = markerUrl;
  },

  data() {
    return {
      tagline: TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
      isSearching: false,
    };
  },

  methods: {
    close() {
      history.pushState(null, "NUS Business", "/map");
      this.$emit("close");
      this.track();
    },

    getLocation() {
      this.isSearching = true;

      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        history.pushState(
          null,
          "NUS Business",
          `map?lat=${latitude}&lng=${longitude}`
        );

        // Pan map to current location
        this.$emit("location", [latitude, longitude]);
        this.close();

        this.track();
      });
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
@import "./utils";

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -10vh;
  text-align: center;

  background: $theme-primary;
}

.overlay-contents {
  color: #fff;
  width: 80%;
  max-width: 50rem;

  display: flex;
  flex-direction: column;

  .title-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    .left-pane {
      flex-grow: 1;
    }

    .right-pane {
      flex-basis: 0;
    }
  }

  button,
  .button {
    height: 5rem;
    margin-bottom: 0;
    font-size: 1.4rem;

    &:disabled {
      opacity: 0.8;
      cursor: auto;
    }
  }

  .or {
    display: block;
    margin: 1rem 0 1.2rem;
  }

  .show-map {
    padding-top: 0.5rem;
    color: inherit;
  }
}

.toilet {
  max-width: 11em;
  height: auto;
  transform: scale(-1, 1);

  // Turn it white.
  // Source: https://codepen.io/sosuke/pen/Pjoqqp
  filter: invert(100%) sepia(1%) saturate(2%) hue-rotate(192deg)
    brightness(108%) contrast(100%);
}

.title {
  color: white;
  font-weight: bold;
  display: inline-block;
  font-size: 7rem;
  text-align: left;
  line-height: 1;
  width: 100%;
}

@media only screen and (max-width: $tablet-width) {
  .toilet {
    display: none;
  }

  .title {
    text-align: center;
  }
}

.tagline {
  font-size: 2rem;
}
</style>
