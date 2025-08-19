/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  const list = element.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  items.forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;

    // IMAGE CELL
    let imgCell = '';
    const picDiv = link.querySelector('.related-consultants-list--picture');
    if (picDiv) {
      const image = picDiv.querySelector('img');
      if (image) imgCell = image;
    }

    // TEXT CELL (must contain all text content, including heading and locations)
    const infoDiv = link.querySelector('.related-consultants-list--info');
    let textCell = '';
    if (infoDiv) {
      // Create a container for all text content
      const textContainer = document.createElement('div');
      // Name (h3)
      const name = infoDiv.querySelector('h3');
      if (name) textContainer.appendChild(name);
      // Locations (all spans inside the infoDiv after h3)
      // There may be multiple locations; join with <br>
      const spanGroup = infoDiv.querySelector('span');
      if (spanGroup) {
        // Find all direct children spans (locations)
        const locations = Array.from(spanGroup.children)
          .map((locSpan) => locSpan.textContent.trim())
          .filter(Boolean);
        if (locations.length > 0) {
          // Add a break, then locations in their own lines
          const locDiv = document.createElement('div');
          locDiv.innerHTML = locations.join('<br>');
          textContainer.appendChild(locDiv);
        }
      }
      textCell = textContainer;
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
