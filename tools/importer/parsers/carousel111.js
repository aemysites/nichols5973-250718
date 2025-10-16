/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel111)'];

  // Find the carousel slides container
  const slidesContainer = element.querySelector('.header-carousel--carousel ul.glide__slides');
  if (!slidesContainer) return;

  // Get all <li> slides (including clones, do NOT deduplicate)
  const slides = slidesContainer.querySelectorAll('.header-carousel.glide__slide');
  if (!slides.length) return;

  // Helper to extract all text content from .header-carousel--content, preserving structure and links
  function getTextCell(contentDiv) {
    if (!contentDiv) return '';
    const txtDiv = contentDiv.querySelector('.header-carousel--txt');
    const parts = [];
    // Featured event label (preserve link)
    if (txtDiv) {
      const small = txtDiv.querySelector('small');
      if (small) {
        const smallClone = document.createElement('div');
        smallClone.appendChild(small.cloneNode(true));
        parts.push(smallClone);
      }
      // Heading (preserve heading level and link)
      const heading = txtDiv.querySelector('h1, h2, h3');
      if (heading) {
        parts.push(heading.cloneNode(true));
      }
      // Any additional content (not present in this example, but allow flexibility)
      Array.from(txtDiv.childNodes).forEach(node => {
        if (node.nodeType === 3) { // text
          const text = node.textContent.trim();
          if (text) parts.push(document.createTextNode(text));
        }
        if (node.nodeType === 1 && !['SMALL','H1','H2','H3','DIV'].includes(node.tagName)) {
          parts.push(node.cloneNode(true));
        }
      });
    }
    // Date (prefer desktop, fallback to mobile)
    let dateDiv = contentDiv.querySelector('.header-carousel-date:not(.mobile)');
    if (!dateDiv) {
      dateDiv = contentDiv.querySelector('.header-carousel-date.mobile');
    }
    if (dateDiv) {
      const dateBlock = document.createElement('div');
      // Month/year
      const monthYear = dateDiv.querySelector('.month-year');
      if (monthYear) {
        const my = document.createElement('div');
        my.innerHTML = monthYear.innerHTML.trim();
        dateBlock.appendChild(my);
      }
      // Day
      const day = dateDiv.querySelector('.day');
      if (day) {
        const d = document.createElement('div');
        d.textContent = day.textContent.trim();
        dateBlock.appendChild(d);
      }
      parts.push(dateBlock);
    }
    return parts.length ? parts : '';
  }

  // Do NOT deduplicate slides: include all slides as in source HTML
  const rows = [];
  Array.from(slides).forEach(slide => {
    const img = slide.querySelector('img');
    const contentDiv = slide.querySelector('.header-carousel--content');
    const textCellContent = getTextCell(contentDiv);
    rows.push([img ? img.cloneNode(true) : '', textCellContent]);
  });

  // Compose table
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace element with block table
  element.replaceWith(blockTable);
}
