/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: matches exactly per example
  const cells = [['Cards (cards113)']];

  // Find the table of cards in the element
  const cardTable = element.querySelector('table');
  if (!cardTable) return;

  // Loop through all table rows
  const trs = Array.from(cardTable.querySelectorAll('tbody > tr'));
  trs.forEach(tr => {
    const tds = Array.from(tr.querySelectorAll('td'));
    tds.forEach(td => {
      // Find the image (must be present)
      const imgEl = td.querySelector('img');
      // Find the CTA link (should contain the card title)
      const ctaLink = td.querySelector('a.link--button');
      // Gather all non-image text content, preserving formatting
      const textContent = document.createDocumentFragment();

      // Extract title from CTA link as heading if present
      if (ctaLink) {
        const heading = document.createElement('strong');
        heading.textContent = ctaLink.textContent.trim();
        textContent.appendChild(heading);
        textContent.appendChild(document.createElement('br'));
      }

      // Extract any <p> tags with non-empty text
      Array.from(td.querySelectorAll('p')).forEach(p => {
        const txt = p.textContent.trim();
        if (txt) {
          textContent.appendChild(document.createTextNode(txt));
          textContent.appendChild(document.createElement('br'));
        }
      });

      // Add CTA link in full (styled as link), only if not already included above
      if (ctaLink) {
        textContent.appendChild(ctaLink);
        textContent.appendChild(document.createElement('br'));
      }

      // Only push row if image and text are present
      if (imgEl && textContent.textContent.trim()) {
        cells.push([imgEl, textContent]);
      }
    });
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
