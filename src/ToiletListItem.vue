<template>
  <p>{{ toilets.length }} toilets</p>
</template>

<script>
export default {
  name: "ToiletListItem",

  props: ["toilets"],
};
</script>

<style scoped></style>
