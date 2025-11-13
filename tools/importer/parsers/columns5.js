/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Columns (columns5)
  const headerRow = ['Columns (columns5)'];

  // Defensive selectors for left and right columns
  const columns = element.querySelectorAll(':scope > div');
  let leftCol, rightCol;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    leftCol = element.querySelector('.video-block__marketing-section');
    rightCol = element.querySelector('.video-block__video-section');
  }

  // --- Left Column Content ---
  // Icon (convert to <img> if mask-image is present)
  let iconDiv = leftCol && leftCol.querySelector('.icon-container');
  let iconImg;
  if (iconDiv && iconDiv.style.maskImage) {
    const urlMatch = iconDiv.style.maskImage.match(/url\(["']?(.*?\.svg)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      iconImg = document.createElement('img');
      iconImg.src = urlMatch[1];
      iconImg.alt = 'Oil Can Icon';
      iconImg.style.backgroundColor = iconDiv.style.backgroundColor;
      iconImg.style.height = iconDiv.style.height;
      iconImg.style.width = iconDiv.style.width;
    }
  }
  // Heading
  let heading = leftCol && leftCol.querySelector('h2');
  // Paragraphs (skip empty ones)
  let paragraphs = [];
  if (leftCol) {
    paragraphs = Array.from(leftCol.querySelectorAll('p')).filter(p => p.textContent.trim());
  }
  // Compose left cell content
  const leftCellContent = [];
  if (iconImg) leftCellContent.push(iconImg);
  else if (iconDiv) leftCellContent.push(iconDiv);
  if (heading) {
    // Trim heading whitespace
    heading.textContent = heading.textContent.trim();
    leftCellContent.push(heading);
  }
  leftCellContent.push(...paragraphs);

  // --- Right Column Content ---
  // Find the main image (video thumbnail)
  let videoImg = rightCol && rightCol.querySelector('.v-image__image img');
  // Find play button overlay (icon)
  let playIcon = rightCol && rightCol.querySelector('.popup-video__icon');
  // Compose right cell content
  const rightCellContent = [];
  if (videoImg) rightCellContent.push(videoImg);
  if (playIcon) {
    // Wrap play icon in a button to indicate interactivity
    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.setAttribute('aria-label', 'Play video');
    playBtn.appendChild(playIcon.cloneNode(true));
    rightCellContent.push(playBtn);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
