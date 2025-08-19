/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background-image URL
  function getBackgroundImageUrl(style) {
    const match = /url\(([^)]+)\)/.exec(style || '');
    return match ? match[1].replace(/['"]/g, '') : null;
  }

  // Table header matches example
  const headerRow = ['Hero (hero23)'];

  // Find image background style
  let imageUrl = null;
  const imageDiv = element.querySelector('.image');
  if (imageDiv) {
    imageUrl = getBackgroundImageUrl(imageDiv.style.backgroundImage);
  }

  // Reference existing element by creating an img element (since only background-image is present)
  let imgEl = null;
  if (imageUrl) {
    // Check if an <img> child exists already
    const existingImg = imageDiv.querySelector('img');
    if (existingImg) {
      imgEl = existingImg;
    } else {
      imgEl = document.createElement('img');
      imgEl.src = imageUrl;
    }
  } else {
    imgEl = '';
  }

  // Second row: image only
  // Third row: content (none present in provided HTML, so empty string)
  const cells = [
    headerRow,
    [imgEl],
    ['']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
