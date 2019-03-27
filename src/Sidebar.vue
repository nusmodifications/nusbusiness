<template>
  <div>
    <toilet-filters></toilet-filters>

    <ol class="toilet-list">
      <li
        v-for="(cluster, index) in shownToilets"
        :key="cluster.id"
        :class="{ hover: highlightToilet === cluster.id }"
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
      >
        <span>{{ index + 1 }}</span>

        Distance: {{ distance(cluster.location, location) }}

        <toilet-list-item :toilets="cluster.toilets" />
      </li>
    </ol>
  </div>
</template>

<script>
import ToiletFilters from "./ToiletFilters";
import ToiletListItem from "./ToiletListItem";
import { distance, renderDistance } from "./utils";

const DEFAULT_RESULTS_COUNT = 10;

export default {
  name: "Sidebar",

  components: {
    ToiletFilters,
    ToiletListItem,
  },

  props: ["location", "toilets", "highlight-toilet"],

  data() {
    return {
      showItems: DEFAULT_RESULTS_COUNT,
    };
  },

  computed: {
    shownToilets() {
      return this.toilets.slice(0, this.showItems);
    },
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
.toilet-list {
  list-style: none;
  padding: 0;
  margin: 0;

  p {
    margin: 0;
  }

  li {
    padding: 0.5rem 0.8rem;
    margin: 0;

    &:hover,
    &.hover {
      cursor: pointer;
      background: rgba(#000, 0.2);
    }
  }
}
</style>
