/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child divs of the main block
  const mainChildren = Array.from(element.querySelectorAll(':scope > div'));

  // Find left and right columns
  const leftCol = mainChildren.find(div => div.classList.contains('nearest-location-block__main'));
  const rightCol = mainChildren.find(div => div.classList.contains('nearest-location-block__marketing'));

  // --- Left Column Content ---
  let leftContent = [];
  if (leftCol) {
    // Title box (icon + heading)
    const titleBox = leftCol.querySelector('.nearest-location-block__title-box');
    if (titleBox) leftContent.push(titleBox);
    // Location box (spinner/loading)
    const locationBox = leftCol.querySelector('.nearest-location-block__location-box');
    if (locationBox) leftContent.push(locationBox);
  }

  // --- Right Column Content ---
  let rightContent = [];
  if (rightCol) {
    // Marketing slider title
    const sliderTitle = rightCol.querySelector('.nearest-location-block__marketing-slider-title');
    if (sliderTitle) rightContent.push(sliderTitle);
    // Carousel: include ALL slides and navigation controls
    const slider = rightCol.querySelector('.my-slider');
    if (slider) {
      // All slides
      const allSlides = Array.from(slider.querySelectorAll('.nearest-location-slider-item'));
      allSlides.forEach(slide => rightContent.push(slide));
      // Navigation arrows
      const controls = rightCol.querySelector('.slide__controls');
      if (controls) rightContent.push(controls);
      // Pagination dots
      const navDots = slider.querySelector('.tns-nav');
      if (navDots) rightContent.push(navDots);
    }
  }

  // --- Table Construction ---
  const headerRow = ['Columns (columns27)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
