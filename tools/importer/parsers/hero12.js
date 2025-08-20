/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from style attribute
  function getBgImgUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^\)]+)\)/i);
    if (match && match[1]) {
      // Remove any surrounding quotes
      return match[1].replace(/^['"]|['"]$/g, '');
    }
    return null;
  }

  // Find the main container with background image
  const bgContainer = element.querySelector('[class*="header-subnav--container"]');
  let bgImgUrl = null;
  if (bgContainer) {
    bgImgUrl = getBgImgUrl(bgContainer);
  }

  // Compose background image element if it exists
  let bgImgElem = null;
  if (bgImgUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImgUrl;
    bgImgElem.alt = '';
  }

  // Extract intro container (contains title, text, link)
  let intro = element.querySelector('.header-subnav--intro');
  if (!intro) {
    // Fallback: use .header-subnav--item if .header-subnav--intro not found
    const item = element.querySelector('.header-subnav--item');
    if (item) intro = item;
  }

  // Compose content cell for row 3
  const contentArr = [];

  // Title (h1.title)
  if (intro) {
    const titleElem = intro.querySelector('h1.title');
    if (titleElem) contentArr.push(titleElem);
    // Subheading (inside .text)
    const subheadingElem = intro.querySelector('.text');
    if (subheadingElem) contentArr.push(subheadingElem);
    // CTA (inside .link)
    const ctaDiv = intro.querySelector('.link');
    if (ctaDiv) {
      // could be empty, check for anchor
      const ctaAnchor = ctaDiv.querySelector('a');
      if (ctaAnchor) contentArr.push(ctaAnchor);
    }
  }

  // Compose rows
  const cells = [];
  cells.push(['Hero (hero12)']);
  cells.push([bgImgElem ? bgImgElem : '']);
  cells.push([contentArr]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
