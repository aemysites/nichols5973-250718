/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero29)'];

  // --- Background Image ---
  let bgImgEl = null;
  // Find a background image from the video poster or video sources
  const bgVideo = element.querySelector('.background-video-2');
  if (bgVideo) {
    let bgImgSrc = bgVideo.getAttribute('data-poster-url');
    if (!bgImgSrc) {
      // Fallback: try getting from <source> elements
      const sources = bgVideo.querySelectorAll('source');
      for (const source of sources) {
        const src = source.getAttribute('src');
        if (src && /\.(jpg|jpeg|png|webp)$/i.test(src)) {
          bgImgSrc = src;
          break;
        }
      }
    }
    if (bgImgSrc) {
      // Reference an <img> element with the background image
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgSrc;
      bgImgEl.setAttribute('loading', 'lazy');
    }
  }
  // Add a cell for the background image (will be empty if not found)
  const bgRow = [bgImgEl || ''];

  // --- Content Row ---
  // Try to extract the main hero content block
  // The visible slide has display != 'none' and usually .slide5 for hero
  let contentRoot = null;
  // Prefer a .slide5 (hero content), fallback to first visible .dd-lp2-container
  let heroSlide = element.querySelector('.dd-lp2-container.slide5');
  if (!heroSlide) {
    // Fallback: first .dd-lp2-container with display != none
    const allSlides = element.querySelectorAll('.dd-lp2-container');
    for (const slide of allSlides) {
      if (slide.style.display !== 'none') {
        heroSlide = slide;
        break;
      }
    }
  }
  // Grab content from .dd-lp2-block if present, else from heroSlide, else from element
  if (heroSlide) {
    const block = heroSlide.querySelector('.dd-lp2-block');
    contentRoot = block || heroSlide;
  } else {
    contentRoot = element;
  }

  // Compose table cell with ALL of the hero content for full fidelity
  // Reference the element directly
  const contentRow = [contentRoot];

  // Assemble table
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
