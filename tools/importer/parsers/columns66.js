/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns66)
  const headerRow = ['Columns (columns66)'];

  // Find the stats container
  const stats = element.querySelector('.stats');
  let columns = [];

  if (stats) {
    // Each stat is a column
    columns = Array.from(stats.querySelectorAll('.stat')).map((stat) => {
      // Extract headline and body text, preserving semantic structure
      const headline = stat.querySelector('.stat__headline');
      const body = stat.querySelector('.stat__body');
      // Create a fragment to preserve formatting and semantics
      const frag = document.createDocumentFragment();
      if (headline) {
        // Use a span for the headline, preserve text and formatting
        const headlineSpan = document.createElement('span');
        headlineSpan.className = 'stat__headline';
        headlineSpan.textContent = headline.textContent.trim();
        frag.appendChild(headlineSpan);
        frag.appendChild(document.createTextNode(' '));
      }
      if (body) {
        // Use a paragraph for the body
        const bodyP = document.createElement('p');
        bodyP.className = 'stat__body';
        bodyP.textContent = body.textContent.trim();
        frag.appendChild(bodyP);
      }
      return frag;
    });
  }

  // Only build the block if we have columns
  if (columns.length > 0) {
    const rows = [
      headerRow,
      columns
    ];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
