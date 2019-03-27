/**
 * Cluster toilets together for the map. The data marks the toilet on each floor as separate,
 * which is not very useful for us, so we naively cluster toilets together to get a rough
 */

const fs = require("fs");
const path = require("path");

const _ = require("lodash");
const Flatbush = require("flatbush");

const toilets = require("./toilets.json");

// Create an index of toilets
const toiletIndex = new Flatbush(toilets.length);
toilets.forEach(toilet => {
  const [y, x] = toilet.location;
  toiletIndex.add(x, y, x, y);
});
toiletIndex.finish();

const clusters = [];
const clusteredToilets = new Set();

const maxDistance = 0.00009; // within 10 meters
toilets.forEach((toilet, current) => {
  if (clusteredToilets.has(current)) return;

  // Find all toilets within 10m of this one
  const [y, x] = toilet.location;
  const cluster = toiletIndex
    .neighbors(
      x,
      y,
      Infinity,
      maxDistance,
      index => !clusteredToilets.has(index)
    )
    .concat([current]);

  cluster.forEach(index => clusteredToilets.add(index));

  // Average out lat and lng of toilets in the cluster
  const clusterLat =
    _.sumBy(cluster, index => toilets[index].location[0]) / cluster.length;
  const clusterLng =
    _.sumBy(cluster, index => toilets[index].location[1]) / cluster.length;

  clusters.push({
    location: [clusterLat, clusterLng],
    toilets: _.sortBy(
      cluster.map(index => toilets[index]),
      toilet => toilet.floor
    )
  });
});

console.log(`Found ${clusters.length} clusters`);

fs.writeFileSync(
  path.join(__dirname, "./clusters-raw.json"),
  JSON.stringify(clusters, null, 2)
);
