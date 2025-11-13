/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the left column (icon, heading, description, link)
  function getLeftColumn(el) {
    const titleRow = el.querySelector('.col-md-6.col-12 .row .base-title');
    let icon = null;
    let heading = null;
    if (titleRow) {
      icon = titleRow.querySelector('.v-image img');
      heading = titleRow.querySelector('h1');
    }
    const desc = el.querySelector('.col-md-6.col-12 .icon-teaser__desc');
    let descParas = [];
    if (desc) {
      descParas = Array.from(desc.querySelectorAll('p'));
    }
    const leftContent = [];
    if (icon) leftContent.push(icon);
    if (heading) leftContent.push(heading);
    leftContent.push(...descParas);
    return leftContent;
  }

  // Helper to get the right column (image with play button overlay)
  function getRightColumn(el) {
    const rightCol = el.querySelector('.col-md-6.col-12:last-of-type');
    let mainImage = null;
    let playIcon = null;
    if (rightCol) {
      mainImage = rightCol.querySelector('.v-image img');
      playIcon = rightCol.querySelector('.popup-video__icon img');
    }
    // Overlay play button on image if both exist
    if (mainImage && playIcon) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      mainImage.style.display = 'block';
      wrapper.appendChild(mainImage.cloneNode(true));
      const overlay = document.createElement('span');
      overlay.style.position = 'absolute';
      overlay.style.top = '50%';
      overlay.style.left = '50%';
      overlay.style.transform = 'translate(-50%, -50%)';
      overlay.style.pointerEvents = 'none';
      overlay.appendChild(playIcon.cloneNode(true));
      wrapper.appendChild(overlay);
      // Optionally, wrap with a button to indicate video trigger
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('aria-label', 'Play video');
      button.style.background = 'none';
      button.style.border = 'none';
      button.style.padding = '0';
      button.style.cursor = 'pointer';
      button.appendChild(wrapper);
      return [button];
    }
    // Fallback: just image
    if (mainImage) return [mainImage];
    return [];
  }

  const headerRow = ['Columns (columns20)'];
  const leftColumn = getLeftColumn(element);
  const rightColumn = getRightColumn(element);
  const contentRow = [leftColumn, rightColumn];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
