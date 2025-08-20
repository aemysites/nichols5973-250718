/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract image URL from style attribute like: background-image: url("...")
  function extractImageUrl(style) {
    const match = /background-image:\s*url\(["']?([^"')]+)["']?\)/.exec(style || '');
    return match ? match[1] : null;
  }

  // Get all tab panes (one per slide)
  const tabContent = element.querySelector('.home-tabs-content');
  if (!tabContent) return;
  const tabPanes = tabContent.querySelectorAll(':scope > .w-tab-pane');

  const rows = [];
  // Header row
  rows.push(['Carousel (carousel52)']);

  tabPanes.forEach((pane) => {
    // Each pane has .slider-base or similar
    const slide = pane.querySelector('.slider-base');
    if (!slide) return;
    // Get text content container
    const slideText = slide.querySelector('.home-slide-text');
    // Get background image URL
    const bgDiv = slide.querySelector('.home-slider-background');
    let imgUrl = '';
    if (bgDiv) {
      imgUrl = extractImageUrl(bgDiv.getAttribute('style'));
    }
    // Create image element if we have a URL
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.loading = 'lazy';
      imgEl.alt = '';
      imgEl.style.maxWidth = '100%';
      imgEl.style.height = 'auto';
    }
    
    // TEXT CELL: Use direct references to original elements if possible
    const cellContent = [];
    if (slideText) {
      // .intro-text, .home-slider-heading, .description-text, .home-slider-button
      const intro = slideText.querySelector('.intro-text');
      if (intro) cellContent.push(intro);
      const heading = slideText.querySelector('.home-slider-heading');
      if (heading) {
        // Wrap in <h2> to maintain heading semantics
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent;
        cellContent.push(h2);
      }
      const desc = slideText.querySelector('.description-text');
      if (desc) cellContent.push(desc);
      const cta = slideText.querySelector('.home-slider-button');
      if (cta) cellContent.push(cta);
    }
    rows.push([
      imgEl,
      cellContent.length > 0 ? cellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
