/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as specified
  const cells = [['Carousel (carousel70)']];

  // Find main slider mask containing slides
  const slider = element.querySelector('.slider.w-slider');
  if (!slider) return;
  const mask = slider.querySelector('.w-slider-mask');
  if (!mask) return;

  // Get all slide elements
  const slides = Array.from(mask.children).filter(child => child.classList.contains('w-slide'));

  slides.forEach((slide) => {
    // Find primary content container inside slide
    const container = slide.querySelector('.slider-container-rai');

    let imageCell = '';
    let textCell = '';

    if (container) {
      // Typical slides have two flex areas: left (text/stat) and right (graphic)
      const flex60 = container.querySelector('._60-flex-rai');
      const flex40 = container.querySelector('._40-flex-rai');
      const coverFlex = container.querySelector('.cover-flex-rai');

      if (flex60 && flex40) {
        // Most slides: stat/text left, graphic right
        textCell = flex60;
        // For the graphic cell, prioritize SVG/Lottie/Video if available
        let graphicElem = flex40.querySelector('svg');
        if (!graphicElem) {
          graphicElem = flex40.querySelector('video');
        }
        if (!graphicElem) {
          graphicElem = flex40.querySelector('[data-animation-type="lottie"]');
        }
        // If none, use entire flex40 block
        imageCell = graphicElem || flex40;
      } else if (coverFlex) {
        // First slide: text only (coverFlex), plus video background as graphic
        textCell = coverFlex;
        // Find video element, which is either a child or sibling of slide
        let videoDiv = slide.querySelector('.w-background-video');
        if (!videoDiv) {
          // Sometimes video comes after container as sibling
          videoDiv = container.nextElementSibling && container.nextElementSibling.classList.contains('w-background-video') ? container.nextElementSibling : null;
        }
        let videoElem = videoDiv ? videoDiv.querySelector('video') : null;
        imageCell = videoElem || videoDiv || '';
      } else {
        // Fallback: use the container as text, and try next sibling for graphic
        textCell = container;
        let nextSibling = container.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('w-background-video')) {
          let videoElem = nextSibling.querySelector('video');
          imageCell = videoElem || nextSibling;
        } else {
          imageCell = '';
        }
      }
    } else {
      // Slide without expected structure: fallback to referencing the slide as content
      textCell = slide;
    }

    // Add row to table. Always [image/graphic, text]
    cells.push([imageCell, textCell]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
