/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image url if present
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      return match[1].replace(/^['"]|['"]$/g, '');
    }
    return null;
  }
  // Get background image as <img> element if present
  const bgUrl = getBackgroundImageUrl(element);
  let bgImgElem = null;
  if (bgUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgUrl;
    bgImgElem.setAttribute('loading', 'lazy');
    bgImgElem.alt = '';
  }

  // Find content container (usually .layout-container)
  const contentContainer = element.querySelector(':scope > .layout-container') || element;
  // Filter child nodes to ignore empty <p> and whitespace
  const children = Array.from(contentContainer.childNodes).filter(node => {
    // Remove empty text nodes
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
    // Remove <p> tags with only whitespace
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && !node.textContent.trim()) return false;
    return true;
  });

  // Block table construction
  const tableRows = [
    ['Hero (hero4)'],
    [bgImgElem || ''], // second row: background image, empty string if none
    [children] // third row: all meaningful content nodes in one cell
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element with block table
  element.replaceWith(table);
}
