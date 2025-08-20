/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const headerRow = ['Cards (cards100)'];
  // Find the main container of cards
  const container = element.querySelector('._960-container');
  if (!container) return;
  const cardEls = Array.from(container.children).filter(e => e.classList.contains('ibl-container-x3'));
  const cards = [];
  cardEls.forEach(cardEl => {
    // Each card has .bkg-image-ibl as the main background/image area
    const bkgImage = cardEl.querySelector('.bkg-image-ibl');
    // Reference the bkgImage block as the image cell
    // For the text cell:
    let textCellContent = [];
    const textBlock = bkgImage ? bkgImage.querySelector('.text-block-100') : null;
    let headingEl = null;
    let descEls = [];
    if (textBlock) {
      // Find heading (class matching *heading*)
      headingEl = textBlock.querySelector('[class*="heading"]');
      // Collect all non-heading children as descriptions
      descEls = Array.from(textBlock.children).filter(child => !child.className.includes('heading'));
    }
    if (headingEl) textCellContent.push(headingEl);
    if (descEls.length) textCellContent.push(...descEls);
    // CTA button: find .button-block-ibl a (use its text content from .button-text-ibl)
    let cta = null;
    const buttonBlock = bkgImage ? bkgImage.querySelector('.button-block-ibl') : null;
    if (buttonBlock) {
      const buttonLink = buttonBlock.querySelector('a.button-link-ibl');
      const buttonText = buttonBlock.querySelector('.button-text-ibl');
      if (buttonLink && buttonText && buttonLink.href) {
        cta = document.createElement('a');
        cta.href = buttonLink.href;
        cta.textContent = buttonText.textContent;
      }
    }
    if (cta) textCellContent.push(cta);
    // Add the row [image, content]
    cards.push([
      bkgImage,
      textCellContent
    ]);
  });
  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
