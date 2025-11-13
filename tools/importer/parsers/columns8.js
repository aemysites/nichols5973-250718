/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children divs
  const topDivs = element.querySelectorAll(':scope > div');

  // Defensive: Expecting at least 2 main columns
  // Left: Main location search & map
  // Right: Questions/info panel

  // --- LEFT COLUMN ---
  // Find main search/map container
  let leftCol = null;
  let rightCol = null;
  for (const div of topDivs) {
    if (div.classList.contains('find-locations-block__main')) {
      leftCol = div;
    } else if (div.classList.contains('find-locations-block__marketing')) {
      rightCol = div;
    }
  }

  // Defensive fallback: If not found, use first/second div
  if (!leftCol && topDivs.length > 0) leftCol = topDivs[0];
  if (!rightCol && topDivs.length > 1) rightCol = topDivs[1];

  // --- LEFT COLUMN CONTENT ---
  // Compose left column content: background image, title box, search box
  const leftColContent = [];
  // Background image (map)
  const bgImg = leftCol.querySelector('img');
  if (bgImg) leftColContent.push(bgImg);
  // Title box (icon + heading)
  const titleBox = leftCol.querySelector('.find-locations-block__title-box');
  if (titleBox) leftColContent.push(titleBox);
  // Search box (form)
  const searchBox = leftCol.querySelector('.find-locations-block__search-box');
  if (searchBox) leftColContent.push(searchBox);

  // --- RIGHT COLUMN CONTENT ---
  // Compose right column content: icon, heading, paragraph, link
  // The rightCol itself is a good container for all its content
  // But we can extract the icon and text separately for clarity
  const rightColContent = [];
  // Icon (mask-image div)
  const iconDiv = rightCol.querySelector('.icon-container');
  if (iconDiv) rightColContent.push(iconDiv);
  // Heading and paragraph
  const infoBox = document.createElement('div');
  const heading = rightCol.querySelector('h2');
  if (heading) infoBox.appendChild(heading);
  const para = rightCol.querySelector('p');
  if (para) infoBox.appendChild(para);
  if (infoBox.childNodes.length) rightColContent.push(infoBox);

  // --- TABLE STRUCTURE ---
  // Header row: block name
  const headerRow = ['Columns (columns8)'];
  // Second row: left and right columns
  const secondRow = [leftColContent, rightColContent];

  // Build table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
