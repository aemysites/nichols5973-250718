/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row for Columns (columns37)
  const headerRow = ['Columns (columns37)'];

  // Find the slideshow container
  const slideshow = element.querySelector('.slideshow-container');
  if (!slideshow) return;

  // Collect all slides (including hidden ones)
  const slides = Array.from(slideshow.querySelectorAll('.mySlides'));

  // For each slide, extract its two columns and append them as new rows
  const rows = [headerRow];
  slides.forEach(slide => {
    const table = slide.querySelector('table');
    if (!table) return;
    const tr = table.querySelector('tr');
    if (!tr) return;
    const tds = Array.from(tr.querySelectorAll('td'));
    if (tds.length < 2) return;
    // Each column cell will contain all its child nodes (preserving formatting)
    const col1 = document.createElement('div');
    Array.from(tds[0].childNodes).forEach(node => col1.appendChild(node.cloneNode(true)));
    const col2 = document.createElement('div');
    Array.from(tds[1].childNodes).forEach(node => col2.appendChild(node.cloneNode(true)));
    rows.push([col1, col2]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
