/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero55)'];

  // 2. Background image row
  let bgImgUrl = null;
  if (element.dataset && element.dataset.hlxBackgroundImage) {
    const match = element.dataset.hlxBackgroundImage.match(/url\(["']?(.+?)["']?\)/);
    if (match) {
      bgImgUrl = match[1];
    }
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
  } else {
    const firstImg = element.querySelector('img');
    if (firstImg) bgImgEl = firstImg.cloneNode(true);
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: extract all content from the hero cell (including all text)
  const contentContainer = element.querySelector('.layout-container') || element;
  // Find the main content cell (table td), fallback to contentContainer
  const heroCell = contentContainer.querySelector('table td') || contentContainer;
  // Instead of picking individual elements, clone all child nodes to preserve all text
  const cleanContent = document.createElement('div');
  heroCell.childNodes.forEach((node) => {
    cleanContent.appendChild(node.cloneNode(true));
  });
  const contentRow = [cleanContent];

  // Compose table
  const rows = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
