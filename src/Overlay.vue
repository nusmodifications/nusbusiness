<template>
  <div class="overlay">
    <h1>NUS Business</h1>
    <button type="button" @click.prevent="getLocation">Let's Go!</button>
  </div>
</template>

<script>
export default {
  name: "Overlay",

  methods: {
    getLocation() {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        history.pushState(
          null,
          "NUS Business",
          `map?lat=${latitude}&lng=${longitude}`
        );

        // Pan map to current location
        this.$emit("location", [latitude, longitude]);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  color: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: rgba(#000, 0.8);
}
</style>
