/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block: 2 columns, multiple rows (each card)
  // Header row
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Find all card containers (each coupon)
  // Each card is a direct child with class 'col-sm-6 col-12'
  const cardContainers = element.querySelectorAll('.col-sm-6.col-12');

  cardContainers.forEach(card => {
    // --- IMAGE CELL ---
    // Find logo image (Valvoline sign)
    const logoImg = card.querySelector('.coupon__logo');
    // Defensive: only include if found
    const imageCellContent = [];
    if (logoImg) imageCellContent.push(logoImg);
    // Also include the visible brand name text as a <p>, if present in alt attribute
    if (logoImg && logoImg.alt) {
      const brandText = document.createElement('p');
      brandText.textContent = logoImg.alt;
      imageCellContent.push(brandText);
    }

    // --- TEXT CELL ---
    // Discount (heading)
    const discount = card.querySelector('.coupon__discount');
    // Title/subheading
    const title = card.querySelector('.coupon__title');
    // Offer details button (CTA)
    const offerDetailsBtn = card.querySelector('.coupon__offer-btn');
    // Offer details hidden text (must include all text content)
    const offerDetailsText = card.querySelector('.coupon-print__details');
    // Expiration
    const expiration = card.querySelector('.coupon__expiration');
    // Actions (Text, Email, Print)
    const actions = card.querySelector('.coupon__actions');
    // Barcode image (should be included in text cell, not image cell)
    const barcodeImg = card.querySelector('.coupon__barcode img');

    // Compose text cell
    const textCellContent = [];
    if (discount) textCellContent.push(discount);
    if (title) textCellContent.push(title);
    if (offerDetailsBtn) textCellContent.push(offerDetailsBtn);
    if (offerDetailsText) textCellContent.push(offerDetailsText);
    if (actions) textCellContent.push(actions);
    if (expiration) textCellContent.push(expiration);
    if (barcodeImg) textCellContent.push(barcodeImg);

    rows.push([
      imageCellContent,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
