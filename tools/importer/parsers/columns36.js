/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single cell
  const headerRow = ['Columns (columns36)'];

  // Find left and right column content
  const podcastContent = element.querySelector('.header-podcast--content');
  const imageContainer = element.querySelector('.image-container');

  // Left column
  const leftCol = [];
  if (podcastContent) {
    const h1 = podcastContent.querySelector('h1');
    if (h1) leftCol.push(h1);
    const iframe = podcastContent.querySelector('iframe');
    if (iframe && iframe.src) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.title || 'Listen';
      link.target = '_blank';
      leftCol.push(link);
    }
    const subtitle = podcastContent.querySelector('.subtitle');
    if (subtitle) leftCol.push(subtitle);
    const hoster = podcastContent.querySelector('.header-podcast--hoster');
    if (hoster) leftCol.push(hoster);
  }

  // Right column
  const rightCol = [];
  if (imageContainer) {
    let img = imageContainer.querySelector('.image-container__image--desktop img');
    if (!img) {
      img = imageContainer.querySelector('.image-container__image--mobile img');
    }
    if (img) rightCol.push(img);
    const imageDesc = imageContainer.querySelector('.image-desc');
    if (imageDesc) rightCol.push(imageDesc);
  }

  // Build content row: 2 columns
  const contentRow = [leftCol, rightCol];

  // Compose cells array so header is a single cell
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
