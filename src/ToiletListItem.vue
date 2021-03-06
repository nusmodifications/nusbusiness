<template>
  <div>
    <p class="title">
      <toilet-index class="index" :index="index"></toilet-index>
      <span class="name">{{ cluster.name }}</span>
      <span class="distance">{{ distance }}</span>
    </p>

    <table class="table">
      <tr v-for="name in sortedClusterNames">
        <th :class="'toilet-' + name.toLowerCase()">
          <toilet-icon :type="name"></toilet-icon>
          {{ name }}
        </th>
        <td>{{ formatFloors(cluster.floors[name]) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import ToiletIndex from "./ToiletIndex";
import ToiletIcon from "./ToiletIcon";
import { deltas, floorName } from "./utils";

export default {
  name: "ToiletListItem",

  components: {
    ToiletIcon,
    ToiletIndex,
  },

  props: ["index", "cluster", "distance"],

  computed: {
    sortedClusterNames() {
      const preferredOrder = ["Unisex", "Male", "Female", "Handicap", "Staff"];
      return Object.keys(this.cluster.floors).sort((a, b) => {
        const aIdx = preferredOrder.indexOf(a);
        const bIdx = preferredOrder.indexOf(b);
        if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    },
  },

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
  margin: 0 0 0.8rem 0;
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
    padding: 0.2rem 0;
    border: none;
    font-weight: bold;
  }

  th {
    width: 11rem;
    padding-left: 0.5rem;
  }
}

.toilet-male {
  color: #2979ff;
}

.toilet-female {
  color: #f50057;
}
</style>
