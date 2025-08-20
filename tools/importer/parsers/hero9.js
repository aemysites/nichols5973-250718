/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // Find the main content wrapper
  const layout = element.querySelector('.layout-container');
  const wrapper = layout ? layout.querySelector('.cta-spotlight-wrapper') : null;

  // Prepare image row
  let imgElem = null;
  if (wrapper) {
    const imgContainer = getChildByClass(wrapper, 'cta-spotlight-img');
    if (imgContainer) {
      // Find image inside the deepest div
      const img = imgContainer.querySelector('img');
      if (img) {
        imgElem = img;
      }
    }
  }

  // Prepare content row
  let contentArr = [];
  if (wrapper) {
    const txtContainer = getChildByClass(wrapper, 'cta-spotlight-txt');
    if (txtContainer) {
      const txtChildren = Array.from(txtContainer.children);
      if (txtChildren.length > 0) {
        contentArr = contentArr.concat(txtChildren);
      }
    }
    const buttonContainer = getChildByClass(wrapper, 'cta-spotlight-button');
    if (buttonContainer) {
      const link = buttonContainer.querySelector('a');
      if (link) {
        contentArr.push(link);
      }
    }
  }

  // Build table rows
  const cells = [
    ['Hero (hero9)'],
    [imgElem ? imgElem : ''],
    [contentArr.length ? contentArr : '']
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
