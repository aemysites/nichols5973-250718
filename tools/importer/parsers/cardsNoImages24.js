/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure element exists and has a child div with the cards
  const mainContainer = element.querySelector(':scope > div');
  if (!mainContainer) return;

  // Build header
  const cells = [['Cards (cardsNoImages24)']];

  // Select all direct card items
  const cardElements = mainContainer.querySelectorAll(':scope > .link-item');
  cardElements.forEach((card) => {
    const contents = [];

    // Heading: Use the <a> inside h3 as a strong element (matches visually)
    const h3 = card.querySelector('h3');
    if (h3) {
      const a = h3.querySelector('a');
      if (a && a.textContent.trim()) {
        // Wrap title text in <strong> to preserve emphasis
        const strong = document.createElement('strong');
        strong.textContent = a.textContent.trim();
        contents.push(strong);
      }
    }

    // Description: use the <p> as is (reference, do not clone)
    const desc = card.querySelector('p');
    if (desc && desc.textContent.trim()) {
      contents.push(desc);
    }

    // No visible text CTA, only an icon, so do not add CTA link
    // (If a visible text CTA/link existed, would add here)

    // Always add one cell per row with all contents
    cells.push([contents]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
