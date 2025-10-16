/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll(':scope > .accordion-body__item');

  items.forEach((item) => {
    // Title cell: find the title container and extract the heading (e.g., h3)
    const titleContainer = item.querySelector('.accordion-body__item--title');
    let titleContent = '';
    if (titleContainer) {
      // Prefer the heading element inside the title container
      const heading = titleContainer.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleContent = heading;
      } else {
        // Fallback: use the full title container
        titleContent = titleContainer;
      }
    }

    // Content cell: find the body container
    const bodyContainer = item.querySelector('.accordion-body__item--body');
    let bodyContent = '';
    if (bodyContainer) {
      // Remove empty <p> tags (as seen in the source HTML)
      const cleanBody = bodyContainer.cloneNode(true);
      cleanBody.querySelectorAll('p').forEach((p) => {
        if (!p.textContent.trim() && p.childElementCount === 0) {
          p.remove();
        }
      });
      // If body is now empty, use an empty string, else use the cleaned body
      if (cleanBody.childElementCount === 0 && !cleanBody.textContent.trim()) {
        bodyContent = '';
      } else {
        bodyContent = Array.from(cleanBody.childNodes);
      }
    }

    rows.push([
      titleContent,
      bodyContent,
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
