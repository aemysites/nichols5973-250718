/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly
  const headerRow = ['Carousel (carousel102)'];

  // Find all slides
  const ul = element.querySelector('ul.glide__slides');
  let slides = [];
  if (ul) {
    slides = Array.from(ul.children).filter(li => li.classList.contains('header-carousel'));
  }

  // Helper: Extract background image URL
  function getBgUrl(style) {
    if (!style) return '';
    const m = /background-image:\s*url\(['"]?([^'")]+)['"]?\)/.exec(style);
    return m ? m[1] : '';
  }

  // Helper: Create <img> for image cell
  function createImg(url) {
    if (!url) return '';
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    return img;
  }

  // Compose rows
  const rows = slides.map(li => {
    // First cell: image (from background-image)
    const bgUrl = getBgUrl(li.getAttribute('style'));
    const img = createImg(bgUrl);

    // Second cell: text content block (reference direct children)
    const txtDiv = li.querySelector('.header-carousel--txt');
    const cellContent = [];
    if (txtDiv) {
      // All direct children of txtDiv (small, headings, date.mobile)
      Array.from(txtDiv.children).forEach(child => {
        cellContent.push(child);
      });
    }
    // Add desktop date if present and not already included
    const dateDiv = li.querySelector('.header-carousel-date:not(.mobile)');
    if (dateDiv && !cellContent.includes(dateDiv)) {
      cellContent.push(dateDiv);
    }
    return [img, cellContent];
  });

  // Assemble table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block table
  element.replaceWith(block);
}
