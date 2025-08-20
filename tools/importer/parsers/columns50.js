/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header row
  const headerRow = ['Columns (columns50)'];

  // Safe-guard main structure
  const mainWrapper = element.querySelector('.rai-main-wrapper');
  if (!mainWrapper) return;
  const sectionWrap = mainWrapper.querySelector('.rai-section-wrap');
  if (!sectionWrap) return;

  // Get the left column: the image
  let leftImage = null;
  const subDiv = sectionWrap.querySelector('.rai-acc-sub');
  if (subDiv) {
    const imageContainer = subDiv.querySelector('.rai-image-container');
    if (imageContainer) {
      leftImage = imageContainer.querySelector('img');
    }
  }

  // Get the right column: heading + principles (titles and descriptions)
  let rightColContent = [];

  // Heading (if present)
  const heading = sectionWrap.querySelector('.acc-rai-heading');
  if (heading) rightColContent.push(heading);

  // Go through each principle block
  if (subDiv) {
    const textContent = subDiv.querySelector('.rai-text-content');
    if (textContent) {
      const textWrap = textContent.querySelector('.rai-text-wrap');
      if (textWrap) {
        const blocks = textWrap.querySelectorAll('.rai-acc-block');
        blocks.forEach((block) => {
          // Title
          const title = block.querySelector('.rai-acc-title');
          if (title) rightColContent.push(title);
          // Description paragraph
          const content = block.querySelector('.rai-acc-content');
          if (content) {
            // There may be a paragraph inside
            const paragraph = content.querySelector('p');
            if (paragraph) rightColContent.push(paragraph);
          }
        });
      }
    }
  }

  // Only proceed if we have at least one column (the right col will always have the heading)
  // If for some reason the image is missing, that's okay: that cell will be empty.
  const columnsRow = [leftImage, rightColContent];

  const cells = [headerRow, columnsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}