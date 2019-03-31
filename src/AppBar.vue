<template>
  <header class="app-bar-container">
    <h3 class="logo unselectable">NUS Business</h3>
  </header>
</template>

<script>
export default {
  name: "AppBar",
};
</script>

<style lang="scss" scoped>
@import "./utils";
@import "./variables";
@import "./utils";

.app-bar-container {
  background-color: $theme-primary;
  color: white;
  padding: 1.3rem;

  .logo {
    font-size: 2.7rem;
    font-weight: bold;
    color: white;
    padding: 0;
    margin: 0;
  }
}
</style>
