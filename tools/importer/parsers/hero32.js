/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block guidelines
  const headerRow = ['Hero (hero32)'];

  // --- 1. No background image: screenshot and html show only geometric background, not an image ---
  // So, leave background row empty

  // --- 2. Find the visible hero text content ---
  // The visible slide is the one with style display: flex (slide2)
  let heroContent = null;
  const slide = element.querySelector('.dd-lp2-container.slide2[style*="display: flex"]');
  if (slide) {
    // The main text wrapper
    const textWrapper = slide.querySelector('.dd-lp2-text-wrapper');
    if (textWrapper) {
      // We'll build a fragment with the percentage and the supporting text
      const frag = document.createDocumentFragment();
      // Percentage (big number)
      const percent = textWrapper.querySelector('.dd-big-percentage');
      if (percent) {
        const h1 = document.createElement('h1');
        h1.textContent = percent.textContent.trim();
        frag.appendChild(h1);
      }
      // Supporting text
      const desc = textWrapper.querySelector('.dd-text-description');
      if (desc) {
        // The description may contain <strong> and text nodes
        // We'll preserve the strong and the rest of the text
        const p = document.createElement('p');
        desc.childNodes.forEach(node => {
          // Only append text nodes and element nodes
          if (node.nodeType === Node.TEXT_NODE) {
            p.appendChild(document.createTextNode(node.textContent));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            p.appendChild(node.cloneNode(true));
          }
        });
        frag.appendChild(p);
      }
      heroContent = frag;
    }
  }

  // --- 3. Assemble the table ---
  const rows = [
    headerRow,
    [''], // No background asset for this hero
    [heroContent ? heroContent : '']
  ];

  // --- 4. Replace the original element ---
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
