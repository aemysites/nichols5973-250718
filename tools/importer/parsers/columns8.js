/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to collect all direct child nodes (including text) of an element as an array
  function getDirectContent(el) {
    const nodes = [];
    if (!el) return nodes;
    el.childNodes.forEach(node => {
      // Use reference to the original node if possible
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        nodes.push(node);
      }
    });
    // Fallback: if nothing, push empty string to ensure cell is never empty
    if (nodes.length === 0) nodes.push('');
    return nodes;
  }

  // Get left column: .landing-subnav--intro
  const intro = element.querySelector('.landing-subnav--intro');
  const leftCol = getDirectContent(intro);

  // Get right column: .landing-subnav--nav-wrapper
  const navWrapper = element.querySelector('.landing-subnav--nav-wrapper');
  const rightCol = getDirectContent(navWrapper);

  // Compose the block table
  const cells = [
    ['Columns (columns8)'],
    [leftCol, rightCol],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
