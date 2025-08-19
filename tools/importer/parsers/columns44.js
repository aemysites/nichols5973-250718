/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL containing the slides
  const slidesList = element.querySelector('ul.glide__slides');
  if (!slidesList) return;

  // Only non-clone event slides
  const slides = Array.from(slidesList.children).filter(
    li => li.classList.contains('event') && !li.classList.contains('glide__slide--clone')
  );
  if (!slides.length) return;

  // Grid arrangement: Use 3 columns per row (as in the example screenshot)
  const columnsPerRow = 3;

  // Helper: for each slide, reference all direct children (preserving semantic meaning)
  function getColumnContent(slide) {
    const nodes = [];
    slide.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        nodes.push(span);
      }
    });
    return nodes;
  }

  // Split slides into grid rows (e.g., 3 columns per row)
  const dataRows = [];
  for (let i = 0; i < slides.length; i += columnsPerRow) {
    const row = slides.slice(i, i + columnsPerRow).map(getColumnContent);
    dataRows.push(row);
  }

  // The header row as a single cell
  const headerRow = ['Columns (columns44)'];
  const cells = [headerRow, ...dataRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
