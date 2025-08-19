/* global WebImporter */
export default function parse(element, { document }) {
  // Utility to find first immediate child with class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }

  // Find main container
  const layoutContainer = getChildByClass(element, 'layout-container');
  if (!layoutContainer) return;

  // Find wrapper inside layoutContainer
  const splitWrapper = getChildByClass(layoutContainer, 'split-text-image-wrapper');
  if (!splitWrapper) return;

  // Extract content (left column)
  let leftContent = getChildByClass(splitWrapper, 'split-text-image__content');
  if (leftContent) {
    const maybeInner = getChildByClass(leftContent, 'split-text-image__content-container');
    if (maybeInner) {
      leftContent = maybeInner;
    }
  }

  // Extract image (right column)
  let rightContent = getChildByClass(splitWrapper, 'split-text-image__image');
  if (rightContent) {
    const maybeInner = getChildByClass(rightContent, 'split-text-image__image-container');
    if (maybeInner) {
      rightContent = maybeInner;
    }
  }

  // Build the table structure as per block guidelines
  const cells = [
    ['Columns (columns16)'],
    [leftContent, rightContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
