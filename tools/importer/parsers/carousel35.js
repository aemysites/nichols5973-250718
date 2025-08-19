/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual slides UL
  const slidesTrack = element.querySelector('.podcast-carousel--carousel .glide__track > ul.glide__slides');
  if (!slidesTrack) return;

  // Get all non-clone LI slides
  const slides = Array.from(slidesTrack.children)
    .filter(li => li.tagName === 'LI' && !li.classList.contains('glide__slide--clone'));
  if (slides.length === 0) return;

  // Block header row (must match example exactly)
  const cells = [['Carousel (carousel35)']];

  slides.forEach(slide => {
    // 1st cell: Image from background-image style
    let img = null;
    const bgStyle = slide.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (bgMatch) {
      img = document.createElement('img');
      img.src = bgMatch[1];
      img.alt = '';
    }

    // 2nd cell: All text content in the slide, robustly
    // We reference the .podcast-carousel--content directly for all text and markup
    const podcastContent = slide.querySelector('.podcast-carousel--content');
    // Reference the original node (not a clone)
    let textContentArr = [];
    if (podcastContent) {
      textContentArr.push(podcastContent);
    } else {
      textContentArr.push('');
    }
    // Add row: always 2 columns per spec
    cells.push([img || '', textContentArr]);
  });

  // Create the table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
