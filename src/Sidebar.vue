<template>
  <div class="wrapper">
    <!--    <toilet-filters></toilet-filters>-->

    <slot name="header"></slot>

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

    <div class="attribution-container">
      <div class="attribution">
        Icons made by
        <a
          href="https://www.flaticon.com/authors/kiranshastry"
          title="Kiranshastry"
          >Kiranshastry</a
        >
        from
        <a href="https://www.flaticon.com/" title="Flaticon"
          >www.flaticon.com</a
        >
        is licensed by
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          title="Creative Commons BY 3.0"
          target="_blank"
          >CC 3.0 BY</a
        >.
      </div>
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
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.toilet-list {
  padding: 0;
  margin: 0;
  list-style: none;

  p {
    margin: 0;
  }

  li {
    padding: 0.5rem 1.2rem;
    margin: 0.8rem;
    border-radius: 5px;

    &:hover,
    &.hover {
      cursor: pointer;
      background: rgba($theme-primary, 0.2);
    }
  }
}

.attribution-container {
  margin-top: auto;

  .attribution {
    color: gray;
    font-size: 1.3rem;
    margin: 2rem;
  }
}
</style>
