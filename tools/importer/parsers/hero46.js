/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero46)'];

  // 2. Extract the hero image
  // The image is nested: .landing-hero-image--image > .image > img
  let heroImg = null;
  const imgContainer = element.querySelector('.landing-hero-image--image .image');
  if (imgContainer) {
    // Reference the existing <img> element (not clone, not src string)
    const img = imgContainer.querySelector('img');
    if (img) {
      heroImg = img;
    }
  }

  // 3. Second row: Background Image (optional)
  // If no image, cell is empty
  const imageRow = [heroImg ? heroImg : ''];

  // 4. Third row: Title, Subheading, CTA (none present in these examples)
  // Leave empty cell if no content
  const textRow = [''];

  // 5. Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow,
  ], document);

  // 6. Replace the original element with the new table
  element.replaceWith(table);
}
