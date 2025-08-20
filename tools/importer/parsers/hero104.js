/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Hero (hero104)'];

  // Get background image URL from either data-datasource or inline style
  let bgUrl = '';
  const ds = element.getAttribute('data-datasource');
  if (ds) {
    try {
      const dsObj = JSON.parse(ds.replace(/&quot;/g, '"'));
      if (dsObj.backgroundImage) {
        bgUrl = dsObj.backgroundImage;
      }
    } catch(e) {}
  }
  if (!bgUrl) {
    const ctaDiv = element.querySelector('.multipurpose-cta');
    if (ctaDiv) {
      const bg = ctaDiv.style.backgroundImage;
      if (bg) {
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match) {
          bgUrl = match[1];
        }
      }
    }
  }
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.setAttribute('loading', 'lazy');
  }

  // Reference content: title, subtitle, CTA - use original document nodes, not clones
  let contentNodes = [];
  const contentDiv = element.querySelector('.multipurpose-cta__content');
  if (contentDiv) {
    contentNodes = contentNodes.concat(Array.from(contentDiv.children));
  }
  // CTA buttons
  const actionsDiv = element.querySelector('.multipurpose-cta__actions');
  if (actionsDiv) {
    Array.from(actionsDiv.children).forEach(child => {
      if (
        child.tagName === 'A' &&
        child.className.indexOf('hidden') === -1 &&
        child.textContent.trim()
      ) {
        contentNodes.push(child);
      }
    });
  }

  // Block Table: 1 column, 3 rows: header, image, content
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentNodes.length > 0 ? contentNodes : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
