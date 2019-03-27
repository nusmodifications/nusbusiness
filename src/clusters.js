import Flatbush from "flatbush";
import toilets from "../data/clusters.json";

const index = new Flatbush(toilets.length);
toilets.forEach(toilet => {
  const [y, x] = toilet.location;
  index.add(x, y, x, y);
});
index.finish();

export default { toilets, index };
