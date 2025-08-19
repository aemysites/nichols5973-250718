/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children
  function getDirectChildren(el, filter) {
    return Array.from(el.children).filter(filter || (() => true));
  }

  // Accordion block header row
  const headerRow = ['Accordion (accordion95)'];
  
  // Get .layout-container
  const container = element.querySelector('.layout-container') || element;
  const children = getDirectChildren(container);

  // Find the first non-empty h2 and the next two non-empty paragraphs (if any)
  let h2 = null;
  let p1 = null,
      p2 = null,
      ul = null;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c.tagName === 'H2' && !h2) {
      h2 = c;
    } else if (c.tagName === 'P' && c.textContent.trim()) {
      if (!p1) p1 = c;
      else if (!p2) p2 = c;
    } else if (c.tagName === 'UL' && !ul) {
      ul = c;
    }
  }

  // Compose the intro content for the first accordion row
  let introTitle = '';
  if (h2) introTitle = h2.textContent.trim();

  const introContent = [];
  if (p1) introContent.push(p1);
  if (p2) introContent.push(p2);

  // Compose accordion rows
  const rows = [];

  // First row: combine intro
  if (introTitle && introContent.length) {
    rows.push([
      introTitle,
      introContent.length === 1 ? introContent[0] : introContent
    ]);
  }

  // Next rows: each li in the ul becomes a row
  if (ul) {
    const lis = getDirectChildren(ul, el => el.tagName === 'LI');
    lis.forEach(li => {
      // Find the main question/title in each li (should be inside a <p><span>)
      let title = '';
      let potential = li.querySelector('span, strong, b, p');
      if (potential) {
        title = potential.textContent.trim();
      } else {
        title = li.textContent.trim();
      }
      // Content cell: empty string for these (no answers in the ul)
      rows.push([
        title,
        ''
      ]);
    });
  }

  // Build the block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
