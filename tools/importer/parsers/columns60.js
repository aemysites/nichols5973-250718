/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns60)'];

  // Find the main content container
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // Find the rich text content
  const richText = layoutContainer.querySelector('.rich-text-basic__text');
  if (!richText) return;

  // Collect all relevant content nodes, but skip <hr> (unless Section Metadata is present, which it is not)
  const contentNodes = [];
  Array.from(richText.children).forEach((node) => {
    // Skip <hr> elements
    if (node.tagName === 'HR') return;
    // Skip empty paragraphs
    if (node.tagName === 'P' && (node.textContent.trim() === '' || node.innerHTML.trim() === '&nbsp;')) return;
    contentNodes.push(node.cloneNode(true));
  });

  // Place all content in a single column cell
  const contentCell = document.createElement('div');
  contentNodes.forEach(n => contentCell.appendChild(n));

  // Compose the rows for the block
  const rows = [headerRow, [contentCell]];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
