export function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Find the straight line distance between two latlngs. Not suitable for large
 * (> 100 km) distances because it does not take into account the curvature
 * of the Earth
 */
export function distance(fromLatlng, toLatlng) {
  const [fromLat, fromLng] = fromLatlng;
  const [toLat, toLng] = toLatlng;

  const R = 6371 * 1000; // meters
  const dLat = toRad(toLat - fromLat);
  const dLon = toRad(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) *
      Math.cos(toRad(toLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

/**
 * Return a distance string formatted with the applicable unit
 */
export function renderDistance(distanceInMeters) {
  if (distanceInMeters > 1000) {
    return (distanceInMeters / 1000).toFixed(2) + "km";
  }

  if (distanceInMeters > 100) {
    return Math.round(distanceInMeters) + "m";
  }

  return distanceInMeters.toFixed(1) + "m";
}
