<template>
  <div>
    <p>{{ cluster.name }}</p>

    <table>
      <tr v-for="(floors, name) in cluster.floors">
        <th>{{ name }}</th>
        <td>{{ floors.join(", ") }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "ToiletListItem",

  props: ["cluster"],

  computed: {
    toiletCount() {
      const count = {};

      this.toilets.forEach(toilet => {
        if (!count[toilet.name]) count[toilet.name] = [];
        count[toilet.name].push(toilet.floor);
      });

      return count;
    },
  },
};
</script>

<style scoped></style>
