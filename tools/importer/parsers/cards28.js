/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards28) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // The cards are in: .teaser-collection__items > .row.rich-text
  const cardContainers = element.querySelectorAll('.teaser-collection__items > .row.rich-text');

  cardContainers.forEach(card => {
    // Each card's content is in .rich-text__body
    const body = card.querySelector('.rich-text__body');
    if (!body) return;

    // --- Image/Icon (first cell) ---
    const img = body.querySelector('img');
    // Defensive: if no image, use null
    const imageCell = img || '';

    // --- Text Content (second cell) ---
    // Title: h2 (may have strong inside)
    const title = body.querySelector('h2');
    // Description: first <p> after h2 (with strong subheading and bullet points)
    // Find all <p> elements after h2
    const paragraphs = Array.from(body.querySelectorAll('p'));
    // The first <p> is the image, skip it
    // The second <p> is the description/subheading and bullets
    // There may be additional <p> for CTA
    let descriptionPara = null;
    let ctaPara = null;
    if (paragraphs.length > 1) {
      descriptionPara = paragraphs[1];
    }
    // CTA: look for <a> with button styling or mailto in a <p> after description
    if (paragraphs.length > 2) {
      ctaPara = paragraphs[2];
    }
    // Compose text cell: title, description, CTA (if present)
    const textCellContent = [];
    if (title) textCellContent.push(title);
    if (descriptionPara) textCellContent.push(descriptionPara);
    if (ctaPara) textCellContent.push(ctaPara);
    rows.push([imageCell, textCellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
