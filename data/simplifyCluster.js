const fs = require("fs");
const path = require("path");
const rawClusters = require("./clusters-raw");

const clusters = [];
for (const { toilets, location } of rawClusters) {
  const name = toilets[0].code.split("-")[0];

  // Sanity check
  if (toilets.some(toilet => !toilet.code.startsWith(name))) {
    console.warn("Toilets do have common prefix name");
    console.warn(toilets);
  }

  // Map toilets to floors
  const floors = {};
  for (const toilet of toilets) {
    // Some names have variations in spelling, so we fix that here
    let key = toilet.name;
    if (key.startsWith("Handicap")) key = "Handicap";

    if (!floors[key]) floors[key] = new Set();
    floors[key].add(toilet.floor);
  }

  for (const name in floors) {
    floors[name] = Array.from(floors[name]).sort((a, b) => a - b);
  }

  clusters.push({
    name,
    location,
    floors,
  });
}

fs.writeFileSync(
  path.join(__dirname, "./clusters.json"),
  JSON.stringify(clusters, null, 2)
);
