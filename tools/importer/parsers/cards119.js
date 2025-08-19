/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards119)'];
  const cells = [headerRow];

  const cardList = element.querySelector('.related-consultants-list--card-row ul');
  if (cardList) {
    cardList.querySelectorAll('li').forEach(li => {
      const link = li.querySelector('a');
      if (!link) return;
      // Image
      const imgDiv = link.querySelector('.related-consultants-list--picture');
      const img = imgDiv ? imgDiv.querySelector('img') : null;
      // Text cell: Title as heading, then description (if present)
      const infoDiv = link.querySelector('.related-consultants-list--info');
      let titleNode = infoDiv ? infoDiv.querySelector('h3') : null;
      const textCell = document.createElement('div');
      // Title as <strong> (or <h3> if you want heading semantics)
      if (titleNode) {
        // Use <strong> for visual consistency with example
        const strong = document.createElement('strong');
        strong.textContent = titleNode.textContent;
        textCell.appendChild(strong);
      }
      // Description (if present)
      // In this HTML, there is no description, but for extensibility, check for <p> siblings or other info
      // Check for any <p> or other text in info div not in h3
      if (infoDiv) {
        infoDiv.childNodes.forEach(child => {
          if (child !== titleNode && child.nodeType === 3) {
            // text node (could be whitespace)
            if (child.textContent.trim()) {
              const p = document.createElement('p');
              p.textContent = child.textContent.trim();
              textCell.appendChild(p);
            }
          } else if (child !== titleNode && child.nodeType === 1 && child.tagName.toLowerCase() === 'p') {
            // paragraph
            textCell.appendChild(child);
          }
        });
      }
      cells.push([
        img ? img : '',
        textCell.childNodes.length ? textCell : ''
      ]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
