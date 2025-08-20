/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the background-image URL from a style string
  function extractBackgroundImageUrl(styleStr) {
    if (!styleStr) return '';
    const m = styleStr.match(/background-image:\s*url\(("|')?(.*?)\1?\)/i);
    return m ? m[2] : '';
  }

  // Find the slides list
  const slidesList = element.querySelector('.header-carousel--carousel .glide__track ul.glide__slides');
  if (!slidesList) return;

  // Only use original slides (not clones)
  const slideEls = Array.from(slidesList.children).filter(li => li.tagName === 'LI' && !li.classList.contains('glide__slide--clone'));

  // Prepare table rows
  const rows = [];
  // Header row, must match the example exactly
  rows.push(['Carousel (carousel105)']);

  slideEls.forEach(slide => {
    // Image cell: create an <img> using the background image URL
    let imgEl = null;
    const bgUrl = extractBackgroundImageUrl(slide.getAttribute('style'));
    if (bgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = bgUrl;
      imgEl.setAttribute('loading', 'lazy');
    }

    // Text content cell: collect all relevant child elements from .header-carousel--content
    const contentDiv = slide.querySelector('.header-carousel--content');
    let textCellContent = [];
    if (contentDiv) {
      // Collect all visual and text content in original order
      // This includes: .header-carousel--txt (with small, heading, description), and date blocks
      Array.from(contentDiv.children).forEach(child => {
        // Only push if not empty
        if (child.textContent && child.textContent.trim() !== '') {
          textCellContent.push(child);
        }
      });
    }
    // If nothing found, fallback to empty string
    if (textCellContent.length === 0) textCellContent = '';

    rows.push([imgEl, textCellContent]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
