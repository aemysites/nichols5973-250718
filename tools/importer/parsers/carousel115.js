/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel header row
  const rows = [['Carousel (carousel115)']];

  // Get all slides except intro/metadata blocks
  const slides = Array.from(element.querySelectorAll('.glmslide-24'));

  slides.forEach((slide) => {
    // First cell: image, which is missing in provided HTML, so we use empty string
    const imageCell = '';

    // Second cell: collect all text content for semantic meaning
    const textCellContent = [];

    // 1. Find heading (if any)
    const headingBlock = slide.querySelector('.glm-fixed-text-block');
    if (headingBlock) {
      Array.from(headingBlock.children).forEach(child => {
        // Only add elements with actual text
        if (child.textContent && child.textContent.trim()) {
          textCellContent.push(child);
        }
      });
    }

    // 2. Find sub-containers with text
    const subContainers = Array.from(slide.querySelectorAll('.glm-sub-container-24'));
    subContainers.forEach(sub => {
      Array.from(sub.children).forEach(child => {
        if (child.textContent && child.textContent.trim()) {
          textCellContent.push(child);
        }
      });
    });

    // 3. Find CTAs (links/buttons)
    const cta = slide.querySelector('.glm-cta-button-24');
    if (cta) {
      Array.from(cta.querySelectorAll('a')).forEach(link => {
        textCellContent.push(link);
      });
    }

    // Only add the row if there is any text to display (always true for these slides)
    rows.push([imageCell, textCellContent]);
  });

  // Create and replace with the carousel block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
