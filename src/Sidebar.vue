<template>
  <div class="wrapper">
    <!--    <toilet-filters></toilet-filters>-->

    <slot name="header"></slot>

    <ol class="toilet-list">
      <li
        v-for="(cluster, index) in toilets"
        :key="cluster.id"
        :class="{
          hover: highlightToilet && highlightToilet.id === cluster.id,
          selected: selectedToilet && selectedToilet.id === cluster.id,
        }"
        @mouseover="hoverToilet(cluster.id)"
        @mouseout="hoverToilet(null)"
        @click.prevent="selectToilet(cluster.id)"
      >
        <toilet-list-item
          :index="index + 1"
          :cluster="cluster"
          :distance="distance(cluster.location, location)"
        />
      </li>

      <li
        v-if="showSelectedToilet"
        :class="{
          hover: highlightToilet && highlightToilet.id === selectedToilet.id,
          selected: true,
        }"
        @mouseover="hoverToilet(selectedToilet.id)"
        @mouseout="hoverToilet(null)"
        @click.prevent="selectToilet(selectedToilet.id)"
      >
        <toilet-list-item
          index="?"
          :cluster="selectedToilet"
          :distance="distance(selectedToilet.location, location)"
        />
      </li>
    </ol>

    <div class="show-more-wrapper">
      <button class="show-more" @click.prevent="showMoreToilets">
        Show more<br />
        business opportunities
      </button>
    </div>

    <div class="attribution-container">
      <div class="attribution">
        Icons made by
        <a href="https://www.freepik.com/" title="Freepik">Freepik</a>,
        <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons"
          >Smashicons</a
        >, and
        <a
          href="https://www.flaticon.com/authors/kiranshastry"
          title="Kiranshastry"
          >Kiranshastry</a
        >
        from
        <a href="https://www.flaticon.com/" title="Flaticon"
          >www.flaticon.com</a
        >
        are licensed by
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

  props: ["location", "toilets", "highlight-toilet", "selected-toilet"],

  computed: {
    showSelectedToilet() {
      return (
        this.selectedToilet &&
        !this.toilets.find(cluster => cluster.id === this.selectedToilet.id)
      );
    },
  },

  methods: {
    distance(fromLatLng, toLatLng) {
      return renderDistance(distance(fromLatLng, toLatLng));
    },

    hoverToilet(index) {
      this.$emit("update:highlight-toilet", index);
    },

    selectToilet(index) {
      this.$emit("update:selected-toilet", index);
    },

    showMoreToilets() {
      this.$emit("show-more");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./variables";

.wrapper {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.toilet-list {
  padding: 0;
  margin: 0 0 1rem;
  list-style: none;

  p {
    margin: 0;
  }

  li {
    padding: 1.3rem 2rem;
    margin: 0;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.3s;

    &:hover,
    &.hover {
      background: rgba($nus-blue, 0.2);
    }

    &.selected {
      background: rgba($nus-orange, 0.2);
      border: 1px solid rgba($nus-orange, 0.6);
    }
  }
}

.show-more-wrapper {
  width: 100%; // The button won't span the entire width on mobile
  display: flex;

  .show-more {
    padding: 0;
    margin: 0 2rem;
    line-height: 1.4;
    height: 6rem;
    font-size: 1.4rem;
    flex: 1;

    &:hover,
    &:active {
      color: unset;
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
