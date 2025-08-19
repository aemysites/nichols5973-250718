/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style string
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    return match ? match[1] : null;
  }

  // Find all tab panes (each is a slide)
  const tabContent = element.querySelector('.home-tabs-content');
  if (!tabContent) return;
  const tabPanes = Array.from(tabContent.querySelectorAll('.w-tab-pane'));

  // Prepare table rows
  const rows = [];
  // Header, block name EXACTLY as in example
  rows.push(['Carousel (carousel52)']);

  tabPanes.forEach((pane) => {
    // Each pane has .slider-base (may have collection-item as well)
    let slider = pane.querySelector('.slider-base');
    if (!slider) return;

    // Get background image URL
    const bgDiv = slider.querySelector('.home-slider-background');
    let imgUrl = null;
    if (bgDiv) {
      imgUrl = extractBgUrl(bgDiv.getAttribute('style') || '');
    }

    // Create image element (mandatory)
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.setAttribute('loading', 'lazy');
    } else {
      imgEl = document.createTextNode('');
    }

    // Gather text content using existing elements
    const textDiv = slider.querySelector('.home-slide-text');
    let textCellContent = [];
    if (textDiv) {
      // Title (optional, styled as a heading)
      const heading = textDiv.querySelector('.home-slider-heading');
      if (heading) {
        // Use <h2> as in example
        const h = document.createElement('h2');
        h.innerHTML = heading.innerHTML;
        textCellContent.push(h);
      }
      // Description (optional)
      const desc = textDiv.querySelector('.description-text');
      if (desc) {
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        textCellContent.push(p);
      }
      // Call to action (optional)
      const cta = textDiv.querySelector('a.home-slider-button');
      if (cta) {
        textCellContent.push(cta); // Reference existing CTA element
      }
    }
    if (textCellContent.length === 1) textCellContent = textCellContent[0];
    if (textCellContent.length === 0) textCellContent = '';

    // Add slide row: [image, text content]
    rows.push([imgEl, textCellContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
