/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero101)'];

  // 2. Background image row
  let bgUrl = null;
  // Try from inline style first
  const ctaDiv = element.querySelector('.multipurpose-cta');
  if (ctaDiv && ctaDiv.style && ctaDiv.style.backgroundImage) {
    const match = ctaDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) bgUrl = match[1];
  }
  // Fallback: try from data-datasource
  if (!bgUrl && element.dataset && element.dataset.datasource) {
    try {
      const ds = JSON.parse(element.dataset.datasource.replace(/&quot;/g, '"'));
      if (ds.backgroundImage) bgUrl = ds.backgroundImage;
    } catch(e) {}
  }
  let imageRow;
  if (bgUrl) {
    // Use a referenced img element for background
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = '';
    imageRow = [img];
  } else {
    imageRow = [''];
  }

  // 3. Content row: title (as heading), subtitle, and CTA
  // Always reference existing elements if possible
  let contentArr = [];
  // Find the content div
  if (ctaDiv) {
    const layoutContainer = ctaDiv.querySelector('.layout-container');
    if (layoutContainer) {
      // Get content (title, subtitle)
      const contentDiv = layoutContainer.querySelector('.multipurpose-cta__content');
      if (contentDiv) {
        // Title
        const h2 = contentDiv.querySelector('h2');
        if (h2) contentArr.push(h2);
        // Subtitle
        const p = contentDiv.querySelector('p');
        if (p) contentArr.push(p);
      }
      // CTA button
      const actionsDiv = layoutContainer.querySelector('.multipurpose-cta__actions');
      if (actionsDiv) {
        // Only add if not hidden and has text
        const btn = actionsDiv.querySelector('a');
        if (btn && btn.textContent.trim()) {
          contentArr.push(btn);
        }
      }
    }
  }
  // If all content missing, preserve cell
  const contentRow = [contentArr.length ? contentArr : ['']];

  // Compose table rows
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Generate the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
