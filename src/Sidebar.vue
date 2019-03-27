<template>
  <div>
    <toilet-filters></toilet-filters>

    <ul class="toilet-list">
      <li v-for="cluster in shownToilets">
        Distance: {{ distance(cluster.location, location) }}

        <toilet-list-item :toilets="cluster.toilets" />
      </li>
    </ul>
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

  props: ["location", "toilets"],

  data() {
    return {
      showItems: 10,
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

    &:hover {
      cursor: pointer;
      background: rgba(#000, 0.2);
    }
  }
}
</style>
