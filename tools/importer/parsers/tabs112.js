/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slides, including the intro and outro (which have different classes)
  const slides = [];
  // First slide (intro)
  const introSlide = element.querySelector('.container-glm-main-24');
  if (introSlide) slides.push(introSlide);
  // Middle slides
  slides.push(...element.querySelectorAll('.glmslide-24'));

  // Build rows for the block table
  const rows = [['Tabs (tabs112)']]; // Header row as required

  slides.forEach((slide, idx) => {
    let label = '';
    let content = '';
    // 1. Intro Slide
    if (slide.classList.contains('container-glm-main-24')) {
      // Use heading as tab label
      const heading = slide.querySelector('h1');
      if (heading) label = heading.textContent.trim();
      else label = '';
      // Sub-text/tag as content
      const sub = slide.querySelector('.sub-text-tag');
      if (sub) content = sub;
      else content = '';
    } else {
      // Other slides
      // Use .sub-text-tag if present as tab label
      const subContainer = slide.querySelector('.glm-sub-container-24');
      const subTag = subContainer ? subContainer.querySelector('.sub-text-tag') : null;
      if (subTag) label = subTag.textContent.trim();
      else {
        // For last slide, which might not have sub-tag, use heading if present
        const heading = slide.querySelector('h1');
        if (heading) label = heading.textContent.trim();
        else label = '';
      }
      // Content is everything meaningful except the label
      const contentEls = [];
      // Gather .glm-text-description elements
      if (subContainer) {
        // Filter out .sub-text-tag (already used as label)
        const descriptions = Array.from(subContainer.querySelectorAll('.glm-text-description'));
        descriptions.forEach(desc => contentEls.push(desc));
      }
      // For last slide, include CTA buttons if present
      const cta = slide.querySelector('.glm-cta-button-24');
      if (cta) contentEls.push(cta);
      // If only one element, just use it directly; if more than one, wrap in a div
      if (contentEls.length === 0) content = '';
      else if (contentEls.length === 1) content = contentEls[0];
      else {
        const div = document.createElement('div');
        contentEls.forEach(el => div.appendChild(el));
        content = div;
      }
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
