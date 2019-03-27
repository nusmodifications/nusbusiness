<template>
  <div>
    <p>{{ name }}</p>
    <p>{{ toilets.length }} toilets</p>
  </div>
</template>

<script>
export default {
  name: "ToiletListItem",

  props: ["toilets"],

  computed: {
    name() {
      const toilet = this.toilets[0];
      return toilet.code.split("-")[0];
    },
  },
};
</script>

<style scoped></style>
