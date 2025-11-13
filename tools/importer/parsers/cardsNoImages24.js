/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages24) block: 1 column, multiple rows, each row is a card
  const headerRow = ['Cards (cardsNoImages24)'];
  const rows = [headerRow];

  // Find all card containers within the parent element
  const cardElements = element.querySelectorAll('.review-block');

  cardElements.forEach((cardEl) => {
    const vCard = cardEl.closest('.v-card');
    if (!vCard) return;

    // Extract review text
    const reviewText = vCard.querySelector('.review-block__text');
    const reviewTextNode = reviewText ? document.createElement('div') : null;
    if (reviewText && reviewTextNode) {
      reviewTextNode.textContent = reviewText.textContent.trim();
    }

    // Extract CTA (the 'More' button) and convert to a link
    const moreBtn = vCard.querySelector('.review-block__btn');
    let moreLink = null;
    if (moreBtn) {
      moreLink = document.createElement('a');
      moreLink.textContent = moreBtn.textContent.trim().toUpperCase();
      moreLink.href = '#';
      moreLink.style.fontWeight = 'bold';
      moreLink.style.textTransform = 'uppercase';
    }

    // Extract reviewer info
    const infoContainer = vCard.querySelector('.review-block__info');
    let reviewerName = null;
    let reviewDate = null;
    if (infoContainer) {
      const nameSpan = infoContainer.querySelector('span:not(.font-italic)');
      const dateSpan = infoContainer.querySelector('.font-italic');
      if (nameSpan) {
        reviewerName = document.createElement('div');
        reviewerName.textContent = nameSpan.textContent.trim();
      }
      if (dateSpan) {
        reviewDate = document.createElement('div');
        reviewDate.textContent = dateSpan.textContent.trim();
        reviewDate.style.fontStyle = 'italic';
      }
    }

    // Extract star icons (img elements inside .v-icon)
    const starIcons = Array.from(vCard.querySelectorAll('.v-icon img'));
    let starsRow = null;
    if (starIcons.length > 0) {
      starsRow = document.createElement('div');
      starIcons.forEach(img => {
        const star = document.createElement('img');
        star.src = img.src;
        star.alt = 'star';
        star.width = img.width || 16;
        star.height = img.height || 16;
        starsRow.appendChild(star);
      });
    }

    // Compose card cell content with clear structure
    const cardContent = document.createElement('div');
    if (reviewTextNode) cardContent.appendChild(reviewTextNode);
    if (moreLink) cardContent.appendChild(moreLink);
    if (reviewerName) cardContent.appendChild(reviewerName);
    if (reviewDate) cardContent.appendChild(reviewDate);
    if (starsRow) cardContent.appendChild(starsRow);

    rows.push([cardContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
