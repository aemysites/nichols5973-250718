/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slideshow container within the block
  const slideshow = element.querySelector('.slideshow-container');
  if (!slideshow) return;

  // Gather all slides
  const slides = Array.from(slideshow.querySelectorAll('.mySlides'));

  // Construct header row
  const headerRow = ['Columns (columns37)'];
  const tableRows = [headerRow];

  // For each slide, find the table > tr > tds (columns)
  slides.forEach((slide) => {
    // Only consider slides with an internal table structure
    const table = slide.querySelector('table');
    if (table) {
      const tr = table.querySelector('tr');
      if (tr) {
        // Get all TDs (columns)
        const tds = Array.from(tr.querySelectorAll('td'));
        // For each td, wrap its content in a div (to preserve block structure)
        const cells = tds.map((td) => {
          const div = document.createElement('div');
          while (td.firstChild) {
            div.appendChild(td.firstChild);
          }
          return div;
        });
        // Only push if there is content (avoid empty rows)
        if (cells.length > 0) {
          tableRows.push(cells);
        }
      }
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
