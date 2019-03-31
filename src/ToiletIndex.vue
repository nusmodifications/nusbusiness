<template>
  <span class="toilet-index">{{ index }}</span>
</template>

<script>
export default {
  name: "ToiletIndex",
  props: ["index"],
};
</script>

<style lang="scss" scoped>
@import "./variables";

.toilet-index {
  $size: 1.7em;

  display: inline-block;
  width: $size;
  height: $size;
  border-radius: 50%;
  line-height: $size;
  color: #fff;
  font-weight: bold;
  background: $theme-primary;
  text-align: center;
  font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
}
</style>
