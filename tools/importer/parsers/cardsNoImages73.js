/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages73) block: 1 column, multiple rows, each row = 1 card
  // Header row must be block name
  const headerRow = ['Cards (cardsNoImages73)'];

  // Only one card in this example, which is the entire content of the element
  // The card content is the anchor element (link) itself
  // Defensive: find the anchor (should be only one)
  const anchor = element.querySelector('a');
  let cardContent;
  if (anchor) {
    cardContent = anchor;
  } else {
    // fallback: use the element's text content
    cardContent = document.createTextNode(element.textContent.trim());
  }

  const rows = [headerRow, [cardContent]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}