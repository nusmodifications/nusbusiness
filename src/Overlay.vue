<template>
  <div class="overlay">
    <div class="overlay-contents">
      <h1 class="title">
        NUS<br />
        Business
      </h1>

      <p class="tagline">{{ tagline }}</p>

      <div class="actions">
        <button
          type="button"
          class="button-primary"
          @click.prevent="getLocation"
          :disabled="isSearching"
        >
          {{ isSearching ? "Hold on to your butts..." : "Use my location" }}
        </button>
        <span class="or">or</span>
        <a href="/map">
          <button type="button" class="action-map" @click.prevent="close">
            Just show me the map
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
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
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./variables";

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

  background: $theme-primary;
}

.overlay-contents {
  color: #fff;
  width: 80%;
  max-width: 80rem;

  display: flex;
  flex-direction: column;
}

.title {
  color: white;
  font-weight: bold;
  display: inline-block;
  font-size: 7rem;
  text-align: left;
  line-height: 1;
}

.tagline {
  font-size: 2rem;
}

.actions {
  button {
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

  .action-map {
    color: inherit;
  }

  a {
    color: inherit;
  }
}
</style>
