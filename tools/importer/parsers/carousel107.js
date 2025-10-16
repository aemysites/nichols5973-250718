/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Carousel (carousel107)'];

  // 2. Find all slides
  // The slides are direct children of '.mask-2-fe-slider.w-slider-mask'
  const mask = element.querySelector('.mask-2-fe-slider.w-slider-mask');
  if (!mask) return;
  const slides = Array.from(mask.querySelectorAll('.fe-slider.w-slide'));

  // 3. Build rows for each slide
  const rows = slides.map((slide) => {
    // Each slide has an image and a text block
    const imgWrap = slide.querySelector('.fe-slide-image-wrap img');
    const textBlock = slide.querySelector('.slider-text-fe');
    // Defensive: Only include if image exists
    const imgCell = imgWrap ? imgWrap : '';
    // Defensive: Only include if text exists
    let textCell = '';
    if (textBlock) {
      // Wrap text in a <div> to preserve formatting
      const div = document.createElement('div');
      // Copy all children (including <strong> etc.)
      Array.from(textBlock.childNodes).forEach((node) => div.append(node.cloneNode(true)));
      textCell = div;
    }
    return [imgCell, textCell];
  });

  // 4. Assemble table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
