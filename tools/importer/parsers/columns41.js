/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Columns (columns41)'];

  // Defensive: Find the main content container
  // The source HTML is an <a> with a nested structure
  // We want two columns: left (stars + headline), right (description)

  // Find the flex row (contains all content)
  const row = element.querySelector('.row.align-center');
  let leftCol, rightCol;

  if (row) {
    // The left column: image (stars) + headline
    // The right column: description
    const flex = row.querySelector('.d-lg-flex');
    if (flex) {
      // Find the star image
      const imgWrap = flex.querySelector('.v-image');
      let starImg = null;
      if (imgWrap) {
        starImg = imgWrap.querySelector('img');
      }
      // Find the headline
      const headlineWrap = flex.querySelector('.rating-block__title');
      let headline = null;
      if (headlineWrap) {
        headline = headlineWrap.querySelector('p');
      }
      // Compose left column: image + headline
      const leftContent = [];
      if (starImg) leftContent.push(starImg);
      if (headline) leftContent.push(headline);
      leftCol = leftContent;

      // Find the description (right column)
      const descWrap = flex.querySelector('.rating-block__desc');
      let desc = null;
      if (descWrap) {
        desc = descWrap.querySelector('p');
      }
      rightCol = desc ? [desc] : [];
    }
  }

  // Fallback: If parsing failed, use the whole element as one cell
  if (!leftCol && !rightCol) {
    leftCol = [element];
    rightCol = [];
  }

  // Compose table rows
  const rows = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
