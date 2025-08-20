/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per guidelines
  const headerRow = ['Accordion (accordion25)'];
  const rows = [headerRow];

  // Find the container that holds all accordion items
  const container = element.querySelector('.acc-container');
  if (!container) return;

  // Get all direct children with class acc-item
  const items = container.querySelectorAll(':scope > .acc-item');
  items.forEach((item) => {
    // Title: find the .acc-tab h3 (the clickable question/header)
    let titleEl = null;
    const tab = item.querySelector('.acc-tab');
    if (tab) {
      const h3 = tab.querySelector('h3');
      if (h3) {
        titleEl = h3;
      } else if (tab.textContent.trim()) {
        // fallback: put all tab text in a <span>
        const span = document.createElement('span');
        span.textContent = tab.textContent.trim();
        titleEl = span;
      }
    }
    // Content: gather all meaningful content inside .acc-pane
    let contentCell = '';
    const pane = item.querySelector('.acc-pane');
    if (pane) {
      // Gather all direct children of pane
      // Some accordion panes have .acc-pane-content, some have lists, some both
      // So, grab all children
      const paneContent = [];
      Array.from(pane.children).forEach((child) => {
        // If this child is .acc-pane-content, grab all its children
        if (child.classList.contains('acc-pane-content')) {
          // Could be p's, ul's, etc.
          Array.from(child.children).forEach((grandchild) => {
            paneContent.push(grandchild);
          });
        } else if (child.tagName === 'UL' || child.tagName === 'OL') {
          paneContent.push(child);
        } else if (child.tagName === 'P') {
          paneContent.push(child);
        }
      });
      // If nothing found, fallback to all text content
      if (paneContent.length === 0 && pane.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = pane.textContent.trim();
        paneContent.push(p);
      }
      // If ul/ol are outside .acc-pane-content, sometimes they're siblings - grab them
      let nextEl = pane.nextElementSibling;
      while (nextEl && (nextEl.tagName === 'UL' || nextEl.tagName === 'OL')) {
        paneContent.push(nextEl);
        nextEl = nextEl.nextElementSibling;
      }
      // Construct the content cell
      if (paneContent.length === 1) {
        contentCell = paneContent[0];
      } else if (paneContent.length > 1) {
        contentCell = paneContent;
      } else {
        contentCell = '';
      }
    }
    // Always add the row if we have a title
    if (titleEl) {
      rows.push([titleEl, contentCell]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
