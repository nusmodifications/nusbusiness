<script>
import maleIconUrl from "./icons/man.svg";
import femaleIconUrl from "./icons/woman.svg";
import handicapIconUrl from "./icons/wheelchair.svg";

const data = src => ({
  class: "toilet-icon",
  attrs: {
    src,
    alt: "",
  },
});

export default {
  name: "ToiletIcon",

  props: ["type"],

  functional: true,

  render(h, context) {
    const type = context.props.type.toLowerCase();

    switch (type) {
      case "male":
        return h("img", data(maleIconUrl));

      case "female":
        return h("img", data(femaleIconUrl));

      case "handicap":
        return h("img", data(handicapIconUrl));

      default:
        return null;
    }
  },
};
</script>

<style lang="scss">
// Global style because Parcel doesn't handle scoped Vue SFC styles correctly
.toilet-icon {
  display: inline-block;
  width: 1.5rem;
  background: currentColor;
  padding: 0.3rem;
  vertical-align: middle;
}
</style>
