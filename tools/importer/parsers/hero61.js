/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class under current element
  function getChildByClass(el, className) {
    return Array.from(el.children).find(child => child.classList.contains(className));
  }
  // Locate containers
  const container = getChildByClass(element, 'layout-container') || element;
  const wrapper = getChildByClass(container, 'cta-spotlight-wrapper') || container;

  // Row 2: Background Image (optional)
  let imgEl = null;
  const imgContainer = getChildByClass(wrapper, 'cta-spotlight-img');
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img');
  }
  const imgRow = [imgEl ? imgEl : ''];

  // Row 3: Title, Subheading, ALL TEXT CONTENT, CTA
  // Collect all child nodes (elements and text) of .cta-spotlight-txt
  const textContainer = getChildByClass(wrapper, 'cta-spotlight-txt');
  const contentParts = [];
  if (textContainer) {
    // Include all child nodes (elements and text) to preserve all text and structure
    for (const node of textContainer.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        contentParts.push(node);
      }
    }
  }
  // Also check for call-to-action button in a separate div (very rare, but present in markup)
  const buttonContainer = getChildByClass(wrapper, 'cta-spotlight-button');
  if (buttonContainer && buttonContainer.childNodes.length > 0) {
    for (const node of buttonContainer.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        contentParts.push(node);
      }
    }
  }
  const contentRow = [contentParts.length > 0 ? contentParts : ''];

  // Table header as specified (exact match)
  const headerRow = ['Hero (hero61)'];
  const cells = [
    headerRow,
    imgRow,
    contentRow,
  ];

  // Create and replace original element with new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
