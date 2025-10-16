/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards57) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards57)'];
  const rows = [headerRow];

  // Find the UL containing all cards
  const ul = element.querySelector('ul.glide__slides');
  if (!ul) return;

  // For each LI (card)
  ul.querySelectorAll('li.insight').forEach((li) => {
    // --- First column: Image ---
    let imageCell = null;
    const imageDiv = li.querySelector('.insight--image');
    if (imageDiv) {
      // Use the <img> element directly
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- Second column: Text ---
    const txtDiv = li.querySelector('.insight--txt');
    const textCellContent = [];
    if (txtDiv) {
      // Tags (optional, above title)
      const tagsDiv = txtDiv.querySelector('.insight--tags');
      if (tagsDiv) {
        // Collect all tag links
        const tags = Array.from(tagsDiv.querySelectorAll('a'));
        if (tags.length) {
          // Wrap tags in a div for grouping
          const tagsWrapper = document.createElement('div');
          tagsWrapper.className = 'card-tags';
          tags.forEach(tag => tagsWrapper.appendChild(tag));
          textCellContent.push(tagsWrapper);
        }
      }
      // Title (h3.heading2 > a)
      const h3 = txtDiv.querySelector('h3.heading2');
      if (h3 && h3.querySelector('a')) {
        const titleLink = h3.querySelector('a');
        // Use <h3> with link inside
        const heading = document.createElement('h3');
        heading.appendChild(titleLink);
        textCellContent.push(heading);
      }
      // Description (optional <p> after h3)
      // In source HTML, <p> is present but empty, so skip unless content
      const p = txtDiv.querySelector('p');
      if (p && p.textContent.trim()) {
        textCellContent.push(p);
      }
      // CTA (link--button)
      const cta = txtDiv.querySelector('a.link--button');
      if (cta) {
        textCellContent.push(cta);
      }
    }

    // Defensive: If image or text missing, skip row
    if (imageCell && textCellContent.length) {
      rows.push([imageCell, textCellContent]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);

  // Add the 'View all Insights' CTA from the bottom, OUTSIDE the table
  const allInsights = element.querySelector('.all-insights--bottom a.link--button.all-insights');
  if (allInsights) {
    // Place the CTA after the table
    block.insertAdjacentElement('afterend', allInsights);
  }
}
