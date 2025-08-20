/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image url from style on the direct child container
  function getBgImageUrl(container) {
    if (!container) return null;
    const style = container.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].trim();
      if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
        url = url.slice(1, -1);
      }
      return url;
    }
    return null;
  }

  // Helper: create <img> element for background image
  function createBgImage(url) {
    if (!url) return null;
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    return img;
  }

  // Get the main container with background-image style
  const container = element.querySelector(':scope > div');
  // Get the background image (if any)
  const bgUrl = getBgImageUrl(container);
  const bgImg = createBgImage(bgUrl);

  // Extract the block content (title, subheading, cta, etc.)
  let contentEl = null;
  if (container) {
    // The first .header-subnav--content
    const contentWrap = container.querySelector(':scope > .header-subnav--content');
    if (contentWrap) {
      const item = contentWrap.querySelector(':scope > .header-subnav--item');
      if (item) {
        const intro = item.querySelector(':scope > .header-subnav--intro');
        if (intro) {
          contentEl = intro;
        }
      }
    }
  }

  // Table structure: header, bg, content
  const cells = [
    ['Hero (hero25)'],
    [bgImg ? bgImg : ''],
    [contentEl ? contentEl : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
