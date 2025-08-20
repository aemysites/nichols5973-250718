/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, exactly one column, matches the example block name
  const headerRow = ['Hero (hero28)'];

  // 2. Background image: find the video poster or fallback to first image
  let backgroundImg = null;
  const videoBg = element.querySelector('.background-video-2');
  if (videoBg) {
    const poster = videoBg.getAttribute('data-poster-url');
    if (poster) {
      backgroundImg = document.createElement('img');
      backgroundImg.src = poster;
      backgroundImg.alt = '';
    }
  }
  if (!backgroundImg) {
    const img = element.querySelector('img');
    if (img) backgroundImg = img;
  }
  const secondRow = [backgroundImg ? backgroundImg : ''];

  // 3. Gather all text content from hero area, as a single cell
  // Find the main block with the content (try to be flexible for variations)
  let contentContainer = null;
  // Prefer the last visible hero text container, as slide5 is the main final hero
  const slides = Array.from(element.querySelectorAll('.dd-lp2-container')); // All slides
  if (slides.length) {
    // Try to use the one with display:flex or display:block, and not display:none
    contentContainer = slides.find(
      s => (s.style.display !== 'none') && (s.style.opacity === '' || Number(s.style.opacity) > 0)
    );
    // If not found, fallback to the last one
    if (!contentContainer) contentContainer = slides[slides.length - 1];
  }
  if (!contentContainer) {
    contentContainer = element.querySelector('.dd-lp2-block')
      || element.querySelector('.dd-lp2-text-wrapper')
      || element;
  }

  // Collect all text and CTA from within the hero block
  // - Headline: h1 or .dd-title-links-lp2
  // - Subheadings: .dd-gaps-list-tagline, .dd-gaps-list-subtitle
  // - CTA: .dd-button-2
  // - Any text blocks or link lists (for resilience)
  const textBits = [];
  const selectors = [
    'h1',
    '.dd-title-links-lp2',
    '.dd-gaps-list-tagline',
    '.dd-gaps-list-subtitle',
    '.dd-gaps-list',
    '.dd-button-2',
    '.dd-replay-button',
  ];
  selectors.forEach(sel => {
    contentContainer.querySelectorAll(sel).forEach(el => {
      if (!textBits.includes(el)) textBits.push(el);
    });
  });

  // For flexibility: also include any paragraph elements and unique text content from the block
  contentContainer.querySelectorAll('p').forEach(p => {
    if (!textBits.includes(p)) textBits.push(p);
  });

  // If for some reason nothing collected, fallback to all h1/h2/p in the block
  if (!textBits.length) {
    contentContainer.querySelectorAll('h1,h2,h3,p,button,a').forEach(el => {
      if (!textBits.includes(el)) textBits.push(el);
    });
  }

  // Compose the table
  const cells = [
    headerRow,
    secondRow,
    [textBits.length ? textBits : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
