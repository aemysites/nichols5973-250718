/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example exactly
  const headerRow = ['Cards (cards75)'];
  const cells = [headerRow];

  // Select the list of consultant cards
  const ul = element.querySelector('ul');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector(':scope > a');
      if (!a) return;
      // Left cell: image (reference existing <img> element)
      const img = a.querySelector('.related-consultants-list--picture img');
      // Right cell: text content (reference actual existing elements)
      const infoDiv = a.querySelector('.related-consultants-list--info');
      const textElems = [];
      if (infoDiv) {
        // Title (use heading level from source, fallback to <strong> if not present)
        let heading = infoDiv.querySelector('h4,h3,h2,h1');
        if (heading) {
          textElems.push(heading);
        }
        // Location (may be nested in spans)
        const locSpans = infoDiv.querySelectorAll('span span');
        locSpans.forEach((span) => {
          // Only add if not empty
          if (span.textContent && span.textContent.trim()) {
            // Wrap location in a div for separation
            const locDiv = document.createElement('div');
            locDiv.textContent = span.textContent.trim();
            textElems.push(locDiv);
          }
        });
        // If there are additional paragraphs or text, include them as well
        infoDiv.querySelectorAll('p').forEach(p => textElems.push(p));
      }
      // If no infoDiv found, fallback to whatever text is available
      if ((!textElems.length) && infoDiv && infoDiv.textContent.trim()) {
        textElems.push(document.createTextNode(infoDiv.textContent.trim()));
      }
      // Compose content for the right cell
      cells.push([
        img,
        textElems.length === 1 ? textElems[0] : textElems
      ]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
