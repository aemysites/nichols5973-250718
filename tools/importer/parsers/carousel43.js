/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the carousel block, matches the example EXACTLY
  const rows = [
    ['Carousel (carousel43)']
  ];

  // Support both: parsing a single row or multiple rows if parent is a container
  let items = [];
  if (element.classList.contains('entry-points__row')) {
    items = [element];
  } else {
    items = Array.from(element.querySelectorAll(':scope > .entry-points__row'));
  }

  items.forEach(row => {
    const anchor = row.querySelector('a.entry-point__item');
    if (!anchor) return;

    // Image extraction (first cell)
    let image = null;
    const imgDiv = anchor.querySelector('.entry-point__item--img');
    if (imgDiv) {
      image = imgDiv.querySelector('img');
    }

    // Second cell: text content, preserve all original document elements
    const content = [];
    const bodyDiv = anchor.querySelector('.entry-point__item--body');
    if (bodyDiv) {
      // Heading
      const h3 = bodyDiv.querySelector('h3');
      if (h3) {
        // Use an H2 to match expected semantic output, but do not clone: keep the node
        // To reference the original node and keep DOM integrity, move h3 into a new h2
        const heading = document.createElement('h2');
        heading.innerHTML = h3.innerHTML;
        content.push(heading);
      }
      // Description
      const p = bodyDiv.querySelector('p');
      if (p) content.push(p);
    }
    rows.push([
      image,
      content
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
