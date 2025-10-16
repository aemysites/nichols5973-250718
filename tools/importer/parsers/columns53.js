/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns53)'];

  // 2. Left column: Heading (h1) and tags (links)
  const titleContainer = element.querySelector('.article-heading--title-container');
  let leftColContent = [];
  if (titleContainer) {
    const h1 = titleContainer.querySelector('h1');
    if (h1) leftColContent.push(h1);
    const tags = titleContainer.querySelector('.article-heading--tags-in-title');
    if (tags) {
      const tagLinks = Array.from(tags.querySelectorAll('a'));
      if (tagLinks.length) leftColContent.push(...tagLinks);
    }
  }

  // 3. Right column: Info (type, authors, date, reading time) with grouping and separator
  const infoContainer = element.querySelector('.article-heading--info');
  let rightColContent = [];
  if (infoContainer) {
    // Type (icon + label)
    const typeDiv = infoContainer.querySelector('.type');
    if (typeDiv) {
      const typeGroup = document.createElement('div');
      const typeImg = typeDiv.querySelector('img');
      const typeLabel = typeDiv.querySelector('span');
      if (typeImg) typeGroup.appendChild(typeImg);
      if (typeLabel) {
        // Uppercase label as in screenshot
        const labelSpan = document.createElement('span');
        labelSpan.textContent = typeLabel.textContent.trim().toUpperCase();
        typeGroup.appendChild(labelSpan);
      }
      if (typeGroup.childNodes.length) rightColContent.push(typeGroup);
    }
    // Authors (images)
    const authorsDiv = infoContainer.querySelector('.authors');
    if (authorsDiv) {
      const authorsGroup = document.createElement('div');
      const authorImgs = Array.from(authorsDiv.querySelectorAll('img'));
      authorImgs.forEach(img => authorsGroup.appendChild(img));
      if (authorsGroup.childNodes.length) rightColContent.push(authorsGroup);
    }
    // Date & reading time (with vertical bar separator)
    const dateDiv = infoContainer.querySelector('.date');
    if (dateDiv && dateDiv.children.length === 2) {
      const metaGroup = document.createElement('div');
      const dateSpan = document.createElement('span');
      dateSpan.textContent = dateDiv.children[0].textContent.trim();
      const sep = document.createTextNode(' | ');
      const timeSpan = document.createElement('span');
      timeSpan.textContent = dateDiv.children[1].textContent.trim();
      metaGroup.appendChild(dateSpan);
      metaGroup.appendChild(sep);
      metaGroup.appendChild(timeSpan);
      rightColContent.push(metaGroup);
    }
  }

  // 4. Build the table
  const tableRows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // 5. Replace original element
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
