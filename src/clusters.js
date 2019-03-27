import Flatbush from "flatbush";
import clusters from "../data/clusters.json";

const index = new Flatbush(clusters.length);
clusters.forEach(toilet => {
  const [y, x] = toilet.location;
  index.add(x, y, x, y);
});
index.finish();

// Inject ID into cluster objects for easy manipulation
const toilets = clusters.map((cluster, id) => ({
  id,
  ...cluster,
}));

export default { toilets, index };
