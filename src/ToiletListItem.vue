<template>
  <div>
    <p class="title">
      <toilet-index class="index" :index="index"></toilet-index>
      <span class="name">{{ cluster.name }}</span>
      <span class="distance">{{ distance }}</span>
    </p>

    <table class="table">
      <tr v-for="(floors, name) in cluster.floors">
        <th>{{ name }}</th>
        <td>{{ formatFloors(floors) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import ToiletIndex from "./ToiletIndex";
import { deltas, floorName } from "./utils";

export default {
  name: "ToiletListItem",

  components: {
    ToiletIndex,
  },

  props: ["index", "cluster", "distance"],

  methods: {
    formatFloors(floors) {
      if (floors.length === 1) return floorName(floors[0]);

      const basements = floors.filter(floor => floor < 0);
      const aboveGround = floors.filter(floor => floor > 0);

      if (
        deltas(basements).every(delta => delta === 1) &&
        deltas(aboveGround).every(delta => delta === 1)
      ) {
        return `${floorName(floors[0])} - ${floorName(
          floors[floors.length - 1]
        )}`;
      }

      return floors.map(floorName).join(", ");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./variables";

.title {
  display: flex;
  margin: 0.6rem 0 0.4rem 0;
  font-weight: bold;
}

.index {
  font-size: 2rem;
}

.name {
  margin: 0 0.9rem;
  font-size: 2rem;
}

.distance {
  margin-left: auto;
  color: $nus-silver;
}

.table {
  width: 100%;
  margin: 0;
  border-collapse: collapse;

  th,
  td {
    padding: 0.3rem 0;
    border: none;
  }

  th {
    width: 8rem;
  }
}
</style>
