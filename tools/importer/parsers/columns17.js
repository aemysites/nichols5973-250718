/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly the specification and be a single column
  const headerRow = ['Columns (columns17)'];

  // Get the content block from the element
  let richText = element.querySelector('.rich-text-basic__text');
  if (!richText) richText = element;

  // Gather all children of the richText block, preserving order and structure
  // Filter out paragraphs that are completely empty or just &nbsp; (preserve content)
  const contentElements = Array.from(richText.children).filter(el => {
    if (el.tagName === 'P') {
      const txt = el.textContent.replace(/\u00a0/g, '').trim();
      return txt.length > 0;
    }
    return true;
  });

  // If no non-empty children, fallback to all children so nothing is lost
  const cellContent = contentElements.length > 0 ? contentElements : Array.from(richText.children);

  // The output: one header, one row with all visible content (single column)
  const cells = [headerRow, [cellContent]];

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
