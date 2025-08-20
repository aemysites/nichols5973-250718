/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row exactly as required
  const headerRow = ['Columns (columns53)'];

  // We'll create two columns: left (title + tags), right (meta/info)

  // LEFT COLUMN
  const titleContainer = element.querySelector('.article-heading--title-container');
  const leftColumnEls = [];

  // Title (h1)
  if (titleContainer) {
    const title = titleContainer.querySelector('.article-heading--title');
    if (title) leftColumnEls.push(title);

    // Tags as list of links
    const tags = titleContainer.querySelector('.heading-tags-mobile.article-heading--tags-in-title');
    if (tags && tags.children.length > 0) {
      const tagList = document.createElement('ul');
      Array.from(tags.children).forEach(tagEl => {
        const li = document.createElement('li');
        li.appendChild(tagEl); // Reference existing <a> elements
        tagList.appendChild(li);
      });
      leftColumnEls.push(tagList);
    }
  }

  // RIGHT COLUMN
  const infoContainer = element.querySelector('.article-heading--info');
  const rightColumnEls = [];

  if (infoContainer) {
    // Type (img + span)
    const typeDiv = infoContainer.querySelector('.type');
    if (typeDiv) rightColumnEls.push(typeDiv);

    // Authors image(s)
    const authorsDiv = infoContainer.querySelector('.authors');
    if (authorsDiv && authorsDiv.children.length > 0) {
      rightColumnEls.push(authorsDiv);
    }

    // Date and time
    const dateDiv = infoContainer.querySelector('.date');
    if (dateDiv) rightColumnEls.push(dateDiv);
  }

  // Compose table row: always 2 columns as visually suggested
  const blockRows = [headerRow, [leftColumnEls, rightColumnEls]];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(blockRows, document);
  element.replaceWith(block);
}
