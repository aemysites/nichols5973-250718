/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero23)'];

  // --- IMAGE ROW ---
  // Find the hero image (reference the actual <img> element)
  let imgEl = null;
  const img = element.querySelector('.v-image__image img');
  if (img) {
    imgEl = img;
  }

  // --- CONTENT ROW ---
  // Find the icon (mask-image div) and headline text
  let contentEls = [];
  const iconContainer = element.querySelector('.hero-block__icon');
  if (iconContainer) {
    contentEls.push(iconContainer);
  }
  const titleWrap = element.querySelector('.hero-block__texts-wrap');
  if (titleWrap) {
    const h1 = titleWrap.querySelector('h1');
    if (h1) {
      contentEls.push(h1);
    }
  }

  // --- TABLE ASSEMBLY ---
  // Each cell must reference the actual element, not clone or create new
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''],
    [contentEls]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
