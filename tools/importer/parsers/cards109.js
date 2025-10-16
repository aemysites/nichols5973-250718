/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards109) block: 2 columns, header row, each row = 1 card (image, text, CTA)

  // 1. Find the parent container holding all cards
  const cardsParent = element.querySelector('.section-2-ibl ._960-container') || element;
  // 2. Find all card containers (each card)
  const cardEls = Array.from(cardsParent.querySelectorAll('.ibl-container-x3'));

  // 3. Prepare header row
  const headerRow = ['Cards (cards109)'];
  const rows = [headerRow];

  // 4. For each card, extract image, text, CTA
  cardEls.forEach(cardEl => {
    // Card image: always inside .bkg-image-ibl > img
    const img = cardEl.querySelector('.bkg-image-ibl img');
    // Card text block: .text-block-100
    const textBlock = cardEl.querySelector('.text-block-100');
    // Card heading: .ibl-heading or .ibl-heading.white
    const heading = textBlock && textBlock.querySelector('.ibl-heading');
    // Card paragraph: .sl-paragraph, .ibl-para, or similar
    let para = textBlock && (textBlock.querySelector('.sl-paragraph, .ibl-para'));
    // If not found, fallback to any div in textBlock that is not the heading
    if (!para && textBlock) {
      para = Array.from(textBlock.children).find(child => child !== heading);
    }
    // Card CTA: .button-block-ibl .button-link-ibl (find the <a> with href)
    let ctaLink = cardEl.querySelector('.button-block-ibl .button-link-ibl[href]');
    let ctaText = cardEl.querySelector('.button-block-ibl .button-text-ibl');
    let cta = null;
    if (ctaLink && ctaText) {
      // Create a new anchor with text and href
      cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.textContent = ctaText.textContent.trim();
      cta.setAttribute('target', '_blank');
      cta.setAttribute('rel', 'noopener noreferrer');
    }

    // 5. Build cell contents
    // First cell: image
    const imgCell = img ? img : '';
    // Second cell: text (heading, para, cta)
    const textCellContent = [];
    if (heading) {
      // Wrap heading in <strong> for block style
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      textCellContent.push(strong);
    }
    if (para) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(para);
    }
    if (cta) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(cta);
    }
    // Remove empty text nodes or elements
    const textCell = textCellContent.filter(Boolean);

    rows.push([imgCell, textCell]);
  });

  // 6. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
