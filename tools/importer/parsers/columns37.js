/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns37)'];
  // Find the slideshow container
  const slideshow = element.querySelector('.slideshow-container');
  if (!slideshow) return;
  // Find all .mySlides
  const slides = Array.from(slideshow.querySelectorAll('.mySlides'));
  const rows = [headerRow];
  slides.forEach((slide) => {
    // Each slide contains a table with two <td>s which are the columns
    const table = slide.querySelector('table');
    if (!table) return;
    const tr = table.querySelector('tr');
    if (!tr) return;
    const tds = Array.from(tr.querySelectorAll('td'));
    // Defensive: ensure we have at least one column
    if (tds.length === 0) return;
    // For each column, collect its children (excluding whitespace-only <p>&nbsp;>)
    const cells = tds.map(td => {
      const content = Array.from(td.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim() !== '';
        if (
          node.nodeType === 1 && node.tagName === 'P' && node.innerHTML.trim() === '&nbsp;'
        ) return false;
        return true;
      });
      // If only one node, return the node itself; otherwise, an array
      return content.length === 1 ? content[0] : content;
    });
    rows.push(cells);
  });
  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
