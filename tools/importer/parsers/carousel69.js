/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Carousel (carousel69)'];
  const cells = [headerRow];

  // Find the main slider container
  const slider = element.querySelector('.slider.w-slider');
  if (!slider) return;
  const mask = slider.querySelector('.w-slider-mask');
  if (!mask) return;
  const slides = mask.querySelectorAll(':scope > .w-slide');

  slides.forEach((slide) => {
    // IMAGE/ANIMATION CELL
    let visualCell = '';
    // Prefer img if present
    const img = slide.querySelector('img');
    if (img) {
      visualCell = img;
    } else {
      // Check for svg (animation or static)
      const svg = slide.querySelector('svg');
      if (svg) {
        visualCell = svg;
      } else {
        // Check for video (background video)
        const video = slide.querySelector('video');
        if (video) {
          // As required: include as a link to src
          let src = '';
          const source = video.querySelector('source');
          if (source && source.getAttribute('src')) {
            src = source.getAttribute('src');
          } else if (video.getAttribute('src')) {
            src = video.getAttribute('src');
          }
          if (src) {
            const a = document.createElement('a');
            a.href = src;
            a.textContent = src;
            visualCell = a;
          } else {
            visualCell = video;
          }
        } else {
          // Check for lottie-animation or lottie JSON animation blocks
          const lottie = slide.querySelector('[data-animation-type="lottie"][data-src]');
          if (lottie) {
            const lottieSrc = lottie.getAttribute('data-src');
            if (lottieSrc) {
              const a = document.createElement('a');
              a.href = lottieSrc;
              a.textContent = lottieSrc;
              visualCell = a;
            }
          }
        }
      }
    }
    // If nothing found, keep as ''

    // TEXT CELL
    let textContent = [];
    // Container for slide text
    const container = slide.querySelector('.slider-container-rai');
    if (container) {
      // Heading
      const heading = container.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textContent.push(heading);
      // Big percentage if present
      const percent = container.querySelector('.big-percentage-rai');
      if (percent) textContent.push(percent);
      // Description(s)
      container.querySelectorAll('.text-rai').forEach((el) => {
        textContent.push(el);
      });
      // Source (optional link or citation)
      const source = container.querySelector('.source-rai');
      if (source) textContent.push(source);
    }
    // If container missing, fallback to direct text nodes with text
    if ((!container || textContent.length === 0)) {
      // get all direct children with textContent
      slide.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.textContent.trim()) {
          textContent.push(node);
        }
      });
    }
    // If still nothing, use empty string
    let textCell = textContent.length > 0 ? textContent : '';
    
    cells.push([visualCell, textCell]);
  });

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
