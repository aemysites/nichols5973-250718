/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Accordion (accordion82)'];
  // Get all accordion items (direct children)
  const items = Array.from(element.querySelectorAll(':scope > .acc-container > .acc-item'));
  const rows = [];

  items.forEach(item => {
    // Title: always from .header--main inside .acc-tab
    const tab = item.querySelector('.acc-tab');
    let titleNode = null;
    if (tab) {
      titleNode = tab.querySelector('.header--main');
    }
    if (!titleNode) return;

    // Content: everything inside .acc-pane (may contain several .acc-pane-content and/or ul)
    const pane = item.querySelector('.acc-pane');
    let contentNodes = [];
    if (pane) {
      // All children of acc-pane, not just content blocks, ensure all relevant content is captured
      const children = Array.from(pane.children);
      children.forEach(child => {
        if (child.classList.contains('acc-pane-content')) {
          // include all child nodes of acc-pane-content (text, elements, etc)
          // Don't lose whitespace nodes, but skip empty text
          contentNodes.push(...Array.from(child.childNodes).filter(node => {
            return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
          }));
        } else if (child.classList.contains('accordion-list-wrap')) {
          // include the whole ul
          contentNodes.push(child);
        } else {
          // fallback: include the node if not empty
          if (child.childNodes.length > 0 || (child.textContent && child.textContent.trim())) {
            contentNodes.push(child);
          }
        }
      });
    }
    // If contentNodes is empty, provide empty string (edge case)
    const contentCell = contentNodes.length === 0 ? '' : (contentNodes.length === 1 ? contentNodes[0] : contentNodes);
    rows.push([
      titleNode,
      contentCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
