/* global WebImporter */
export default function parse(element, { document }) {
  // Tab labels as seen in the screenshot/tab bar
  const tabLabels = ['External Threats', 'Leadership Preparedness'];

  // Find all tab slides
  const tabSlides = Array.from(element.querySelectorAll('.glmslide-24'));
  const rows = [];

  // --- Collect hero section text and world map image ---
  const heroBlock = document.createElement('div');
  const heroHeading = element.querySelector('.glm-fixed-text-block h1');
  if (heroHeading) {
    const headingDiv = document.createElement('div');
    headingDiv.textContent = heroHeading.textContent.trim();
    heroBlock.appendChild(headingDiv);
  }
  const heroSub = element.querySelector('.container-glm-main-24 .sub-text-tag._24');
  if (heroSub) {
    const subDiv = document.createElement('div');
    subDiv.textContent = heroSub.textContent.trim();
    heroBlock.appendChild(subDiv);
  }
  // Add world map image if present
  const worldMapImg = element.querySelector('img[src*="world-map-purple"]');
  if (worldMapImg) {
    heroBlock.appendChild(worldMapImg.cloneNode(true));
  }

  // --- External Threats tab: combine slide 0 and slide 1 ---
  if (tabSlides[0] && tabSlides[1]) {
    const tabContentBlock = document.createElement('div');
    // Add hero block at the top
    if (heroBlock.childNodes.length) tabContentBlock.appendChild(heroBlock.cloneNode(true));
    // Slide 0: Emerging threat
    const slide0 = tabSlides[0];
    const subLabel0 = slide0.querySelector('.sub-text-tag._24');
    if (subLabel0) {
      const labelDiv = document.createElement('div');
      labelDiv.textContent = subLabel0.textContent.trim();
      tabContentBlock.appendChild(labelDiv);
    }
    Array.from(slide0.querySelectorAll('.glm-text-description')).forEach(el => tabContentBlock.appendChild(el.cloneNode(true)));
    // Slide 1: Highest ranked threats
    const slide1 = tabSlides[1];
    const subLabel1 = slide1.querySelector('.sub-text-tag._24');
    if (subLabel1) {
      const labelDiv = document.createElement('div');
      labelDiv.textContent = subLabel1.textContent.trim();
      tabContentBlock.appendChild(labelDiv);
    }
    Array.from(slide1.querySelectorAll('.glm-text-description')).forEach(el => tabContentBlock.appendChild(el.cloneNode(true)));
    rows.push([tabLabels[0], tabContentBlock]);
  }

  // Leadership Preparedness tab: slide 2 + slide 4 (final slide with CTA)
  if (tabSlides[2] || tabSlides[3]) {
    const tabContentBlock = document.createElement('div');
    // Add hero block at the top
    if (heroBlock.childNodes.length) tabContentBlock.appendChild(heroBlock.cloneNode(true));
    // Slide 2: Leadership Preparedness
    if (tabSlides[2]) {
      const slide = tabSlides[2];
      const subLabelEl = slide.querySelector('.sub-text-tag._24');
      if (subLabelEl) {
        const labelDiv = document.createElement('div');
        labelDiv.textContent = subLabelEl.textContent.trim();
        tabContentBlock.appendChild(labelDiv);
      }
      Array.from(slide.querySelectorAll('.glm-text-description')).forEach(el => tabContentBlock.appendChild(el.cloneNode(true)));
    }
    // Slide 4: Final slide with CTA and extra text
    if (tabSlides[3]) {
      // Heading if present
      const lastHeading = tabSlides[3].querySelector('.glm-fixed-text-block h1');
      if (lastHeading) {
        const headingDiv = document.createElement('div');
        headingDiv.textContent = lastHeading.textContent.trim();
        tabContentBlock.appendChild(headingDiv);
      }
      // Sub container text
      Array.from(tabSlides[3].querySelectorAll('.glm-text-description')).forEach(el => tabContentBlock.appendChild(el.cloneNode(true)));
      // CTA buttons
      Array.from(tabSlides[3].querySelectorAll('a')).forEach(a => tabContentBlock.appendChild(a.cloneNode(true)));
    }
    rows.push([tabLabels[1], tabContentBlock]);
  }

  // Table header
  const headerRow = ['Tabs (tabs122)'];
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
