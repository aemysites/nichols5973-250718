/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image url from inline CSS: background-image: url(...)
  function getBgImgUrl(el) {
    if (!el) return null;
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]*)\)/);
    return match ? match[1].replace(/['"]/g, '') : null;
  }

  // Find the background image in the .image div
  const imageDiv = element.querySelector('.image');
  let bgImageEl = '';
  if (imageDiv) {
    const bgImageUrl = getBgImgUrl(imageDiv);
    if (bgImageUrl) {
      bgImageEl = document.createElement('img');
      bgImageEl.src = bgImageUrl;
      bgImageEl.setAttribute('loading', 'lazy');
    }
  }

  // The HTML examples do NOT have any heading, subheading, or CTA markup.
  // So, row 3 is left empty as in the example markdown.

  // Compose the block table as required: 3 rows, 1 column, header matches template
  const cells = [
    ['Hero (hero47)'], // header row
    [bgImageEl],      // background image row
    ['']              // content row (empty)
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
