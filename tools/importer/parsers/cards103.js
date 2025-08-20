/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers
  const cardContainers = Array.from(element.querySelectorAll('.ibl-container-x3'));

  // Header row
  const cells = [
    ['Cards (cards103)']
  ];

  cardContainers.forEach((card) => {
    // Find background image from .bkg-image-ibl
    let imageEl = '';
    const bkg = card.querySelector('.bkg-image-ibl');
    if (bkg) {
      // Try to extract background-image from style attribute or computed style
      let bgUrl = null;
      let styleAttr = bkg.getAttribute('style') || '';
      let bgMatch = styleAttr.match(/background-image:\s*url\(["']?(.*?)["']?\)/i);
      if (!bgMatch && bkg.style && bkg.style.backgroundImage) {
        bgMatch = bkg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
      }
      if (!bgMatch) {
        // fallback to computed style
        const cs = window.getComputedStyle(bkg);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') {
          bgMatch = cs.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
        }
      }
      if (bgMatch && bgMatch[1]) {
        const img = document.createElement('img');
        img.src = bgMatch[1];
        img.alt = '';
        imageEl = img;
      }
    }

    // Extract text content (title, description)
    const textBlock = card.querySelector('.text-block-100');
    const textContent = [];
    if (textBlock) {
      // Title (heading)
      const title = textBlock.querySelector('.ibl-heading');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.push(strong);
        textContent.push(document.createElement('br'));
      }
      // Description
      let desc = textBlock.querySelector('.sl-paragraph, .ibl-para');
      if (desc && desc.textContent.trim()) {
        textContent.push(desc);
      }
    }

    // CTA button - find the anchor with a non-empty href
    const buttonLink = card.querySelector('.button-block-ibl .button-link-ibl[href]');
    if (buttonLink && buttonLink.href) {
      // Find text from sibling .button-text-ibl
      let btnText = '';
      const btnTextEl = card.querySelector('.button-block-ibl .button-text-ibl');
      if (btnTextEl && btnTextEl.textContent.trim()) {
        btnText = btnTextEl.textContent.trim();
      } else {
        btnText = buttonLink.textContent.trim() || 'Learn More';
      }
      const a = buttonLink;
      a.textContent = btnText;
      a.setAttribute('target', '_blank');
      textContent.push(document.createElement('br'));
      textContent.push(a);
    }
    // Remove trailing <br> if present
    while (textContent.length && textContent[textContent.length - 1].tagName === 'BR') {
      textContent.pop();
    }

    // Build the row: [image, text content]
    cells.push([
      imageEl || '',
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
