/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the inner content and image elements
  function getContentAndImage(block) {
    const wrapper = block.querySelector('.split-text-image-wrapper') || block;
    const content = wrapper.querySelector('.split-text-image__content .split-text-image__content-container') || wrapper.querySelector('.split-text-image__content') || null;
    const imageContainer = wrapper.querySelector('.split-text-image__image .split-text-image__image-container') || wrapper.querySelector('.split-text-image__image') || null;
    const img = imageContainer ? imageContainer.querySelector('img') : null;
    return { content, image: img };
  }

  // Find all consecutive split-text-image blocks (for multi-column layout)
  let blocks = [];
  if (element.classList.contains('split-text-image')) {
    let curr = element;
    while (curr && curr.classList && curr.classList.contains('split-text-image')) {
      blocks.push(curr);
      curr = curr.nextElementSibling;
    }
  } else {
    blocks = [element];
  }

  // Build the table rows
  const rows = [];
  // Header row must match block name exactly
  rows.push(['Columns (columns43)']);

  // For each block, extract columns in correct order
  blocks.forEach(block => {
    const { content, image } = getContentAndImage(block);
    // Determine order by DOM position
    let columns = [];
    if (content && image) {
      const wrapper = block.querySelector('.split-text-image-wrapper') || block;
      const children = Array.from(wrapper.children);
      const contentIdx = children.indexOf(content.parentElement.parentElement || content.parentElement || content);
      const imageIdx = children.indexOf(image.parentElement.parentElement.parentElement || image.parentElement.parentElement || image.parentElement || image);
      if (imageIdx < contentIdx) {
        // Image left, text right
        columns = [image, content];
      } else {
        // Text left, image right
        columns = [content, image];
      }
    } else if (content) {
      columns = [content];
    } else if (image) {
      columns = [image];
    }
    // Always reference the actual DOM nodes, not clones
    rows.push(columns);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
