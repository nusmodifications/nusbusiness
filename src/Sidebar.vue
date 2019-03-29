<template>
  <div class="wrapper">
    <!--    <toilet-filters></toilet-filters>-->

    <ol class="toilet-list">
      <li
        v-for="(cluster, index) in toilets"
        :key="cluster.id"
        :class="{ hover: highlightToilet === cluster.id }"
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
      >
        <toilet-list-item
          :index="index + 1"
          :cluster="cluster"
          :distance="distance(cluster.location, location)"
        />
      </li>
    </ol>

    <div class="attribution">
      Icons made by
      <a
        href="https://www.flaticon.com/authors/kiranshastry"
        title="Kiranshastry"
        >Kiranshastry</a
      >
      from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      is licensed by
      <a
        href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0"
        target="_blank"
        >CC 3.0 BY</a
      >
    </div>
  </div>
</template>

<script>
import ToiletFilters from "./ToiletFilters";
import ToiletListItem from "./ToiletListItem";
import { distance, renderDistance } from "./utils";

export default {
  name: "Sidebar",

  components: {
    ToiletFilters,
    ToiletListItem,
  },

  props: ["location", "toilets", "highlight-toilet"],

  data() {
    return {};
  },

  methods: {
    distance(fromLatLng, toLatLng) {
      return renderDistance(distance(fromLatLng, toLatLng));
    },

    hoverToilet(index) {
      this.$emit("update:highlight-toilet", index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./variables";

.wrapper {
  overflow: auto;
}

.toilet-list {
  padding: 0;
  margin: 0;
  list-style: none;

  p {
    margin: 0;
  }

  li {
    padding: 0.5rem 0.8rem;
    margin: 0;

    &:hover,
    &.hover {
      cursor: pointer;
      background: rgba($theme-primary, 0.2);
    }
  }
}

.attribution {
  opacity: 0.7;
  margin: 4rem 2rem;
}
</style>
