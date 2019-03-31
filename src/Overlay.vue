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
          <img class="toilet white-svg" :src="toiletUrl" alt="Toilet" />
        </div>
      </div>

      <transition name="spin" mode="out-in">
        <p :key="tagline" class="tagline">{{ tagline }}</p>
      </transition>

      <button type="button" class="button-primary" @click.prevent="getLocation">
        Use my location
      </button>
      <span class="or">or</span>
      <a href="/map" class="button show-map" @click.prevent="close">
        Just show me the map
      </a>
    </div>
  </div>
</template>

<script>
import toiletUrl from "./icons/toilet.svg";

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
    this.toiletUrl = toiletUrl;
  },

  mounted() {
    this.intervalId = setInterval(() => {
      this.taglineIndex = (this.taglineIndex + 1) % TAGLINES.length;
    }, 8000);
  },

  beforeDestroy() {
    clearInterval(this.intervalId);
  },

  data() {
    return {
      taglineIndex: Math.floor(Math.random() * TAGLINES.length),
    };
  },

  computed: {
    tagline() {
      return TAGLINES[this.taglineIndex];
    },
  },

  methods: {
    close() {
      history.pushState(null, "NUS Business", "/map");
      this.$emit("close");
      this.track();
    },

    getLocation() {
      this.$emit("locate");
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
