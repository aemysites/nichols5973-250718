/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns (columns1)'];

  // Find left navigation columns and right info column
  const leftLinks = element.querySelector('.footer-left-links');
  const infoCol = element.querySelector('.footer__info');

  // Extract the three navigation columns from leftLinks
  let navColumns = [];
  if (leftLinks) {
    const navRow = leftLinks.querySelector('.row');
    if (navRow) {
      navColumns = Array.from(navRow.children).map(col => {
        // Remove empty elements from each nav column
        const cleanCol = col.cloneNode(true);
        Array.from(cleanCol.querySelectorAll(':empty')).forEach(el => el.remove());
        // Fix: ensure Messenger icon <img> is present
        const messengerIcon = col.querySelector('.v-image.v-responsive img');
        if (messengerIcon && !cleanCol.contains(messengerIcon)) {
          // Find the parent div for Messenger icon and append the img
          const messengerDiv = cleanCol.querySelector('.v-image.v-responsive');
          if (messengerDiv) messengerDiv.appendChild(messengerIcon.cloneNode(true));
        }
        return cleanCol;
      });
    }
  }

  // The right info column is a cell
  let infoCell = null;
  if (infoCol) {
    // Clone and clean the infoCol
    infoCell = infoCol.cloneNode(true);
    Array.from(infoCell.querySelectorAll(':empty')).forEach(el => el.remove());
    // Ensure logo image is included
    const logo = element.querySelector('.footer__logo img');
    if (logo && !infoCell.contains(logo)) {
      infoCell.appendChild(logo.cloneNode(true));
    }
    // Fix: ensure social media icons are present
    const socialDiv = infoCell.querySelector('.footer__social');
    if (socialDiv) {
      // For each social <a>, ensure the <img> is present
      const originalSocialDiv = element.querySelector('.footer__social');
      if (originalSocialDiv) {
        const socialLinks = Array.from(originalSocialDiv.querySelectorAll('a'));
        socialLinks.forEach((a, i) => {
          const img = a.querySelector('img');
          if (img) {
            const infoSocialLinks = socialDiv.querySelectorAll('a');
            if (infoSocialLinks[i] && !infoSocialLinks[i].querySelector('img')) {
              infoSocialLinks[i].appendChild(img.cloneNode(true));
            }
          }
        });
      }
    }
    // Fix: preserve line breaks in customer service block
    const custServ = infoCell.querySelector('.footer__customer-service p');
    if (custServ) {
      // Replace <br> with actual <br> elements
      custServ.innerHTML = custServ.innerHTML.replace(/<br>/g, '<br>');
    }
  }

  // Compose the second row: three nav columns + right info column
  const secondRow = [...navColumns, infoCell].filter(Boolean);

  // Table: header row, then content row
  const tableCells = [headerRow, secondRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
