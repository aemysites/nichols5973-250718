/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards77)'];
  const rows = [];
  const ul = element.querySelector('ul');
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li');
    lis.forEach(li => {
      const a = li.querySelector('a');
      let image = '';
      let textContent = [];
      if (a) {
        // Image
        const pictureDiv = a.querySelector('.related-consultants-list--picture');
        if (pictureDiv) {
          const img = pictureDiv.querySelector('img');
          if (img) image = img;
        }
        // Title & Description
        const infoDiv = a.querySelector('.related-consultants-list--info');
        if (infoDiv) {
          // Collect all children in order (e.g. <h3>, <p>, etc.)
          const children = Array.from(infoDiv.childNodes).filter(node => {
            // Only elements (not comments)
            return node.nodeType === 1;
          });
          if (children.length > 0) {
            textContent = children;
          }
        }
      }
      rows.push([image, textContent.length > 0 ? textContent : '']);
    });
  }
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}