/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the columns block
  const headerRow = ['Columns (columns11)'];

  // Helper to extract all content from a column (including text and elements)
  function extractAllContent(col) {
    if (!col) return '';
    // Clone to avoid modifying source
    const clone = col.cloneNode(true);
    // Remove hidden confirmation message
    const confirmation = clone.querySelector('.email-only--confirmation');
    if (confirmation) confirmation.remove();
    // Remove any hidden elements
    clone.querySelectorAll('[style*="display: none"]').forEach(e => e.remove());
    // Return all children (preserves structure and ensures all text is included)
    return Array.from(clone.childNodes);
  }

  // Find all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > .footer--top-column'));

  // Defensive fallback: if not exactly 3 columns, use all direct children
  let col1 = columns[0] || null;
  let col2 = columns[1] || null;
  let col3 = columns[2] || null;
  if (columns.length !== 3) {
    const fallbackColumns = Array.from(element.children);
    col1 = fallbackColumns[0] || null;
    col2 = fallbackColumns[1] || null;
    col3 = fallbackColumns[2] || null;
  }

  // Each cell must be a separate cell in the row, with all content (not just visible)
  const contentRow = [
    extractAllContent(col1),
    extractAllContent(col2),
    extractAllContent(col3)
  ];

  // Create the table with the correct header and content row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
