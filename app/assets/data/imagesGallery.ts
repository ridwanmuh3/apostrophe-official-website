const IMAGE_PREFIX = "/images/gallery/dokumentasi-";

export default Array.from(
  { length: 24 },
  (_, i) => IMAGE_PREFIX + String(i + 1) + ".jpg"
);
