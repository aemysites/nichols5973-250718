/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul class="glide__slides"> inside the element
  const slidesList = element.querySelector('ul.glide__slides');
  if (!slidesList) return;

  // Get all unique event cards (deduplicate by title)
  const eventCards = Array.from(slidesList.children)
    .filter(li => li.classList.contains('event'));
  const seenTitles = new Set();
  const uniqueCards = [];
  for (const card of eventCards) {
    const titleEl = card.querySelector('.heading4');
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    if (!seenTitles.has(titleText) && titleText) {
      seenTitles.add(titleText);
      uniqueCards.push(card);
      if (uniqueCards.length === 3) break; // Only need 3 columns as in screenshot
    }
  }

  // Each card becomes a column in the second row
  const columnsRow = uniqueCards.map(card => {
    // Extract date
    const day = card.querySelector('.event--date-day')?.textContent.trim() || '';
    const monthYear = card.querySelector('.event--date-month-year')?.textContent.trim() || '';
    // Extract title
    const titleLink = card.querySelector('.heading4 a');
    let titleNode;
    if (titleLink) {
      titleNode = document.createElement('p');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent;
      a.target = '_blank';
      a.style.fontWeight = 'bold';
      titleNode.appendChild(a);
      titleNode.style.fontWeight = 'bold';
      titleNode.style.marginBottom = '0.5em';
    }
    // Extract description
    const descEl = card.querySelector('p');
    let descNode;
    if (descEl) {
      descNode = descEl.cloneNode(true);
      descNode.style.marginBottom = '0.5em';
    }
    // Extract speakers/consultants
    const speakersDiv = card.querySelector('.speakers');
    let speakerImgs = [];
    if (speakersDiv) {
      speakerImgs = Array.from(speakersDiv.querySelectorAll('img')).map(img => {
        const clone = img.cloneNode(true);
        clone.style.width = '32px';
        clone.style.height = '32px';
        clone.style.borderRadius = '50%';
        clone.style.objectFit = 'cover';
        clone.style.marginRight = '4px';
        return clone;
      });
    }
    const speakerCountSpan = speakersDiv ? speakersDiv.querySelector('span') : null;
    // Compose cell content
    const cell = document.createElement('div');
    // Date
    const dateNode = document.createElement('div');
    dateNode.style.marginBottom = '0.5em';
    const daySpan = document.createElement('span');
    daySpan.textContent = day;
    daySpan.style.color = '#1647b5';
    daySpan.style.fontSize = '2em';
    daySpan.style.fontWeight = 'bold';
    daySpan.style.marginRight = '0.3em';
    const monthYearSpan = document.createElement('span');
    monthYearSpan.textContent = monthYear;
    monthYearSpan.style.color = '#1647b5';
    monthYearSpan.style.fontSize = '1em';
    dateNode.appendChild(daySpan);
    dateNode.appendChild(monthYearSpan);
    cell.appendChild(dateNode);
    // Title
    if (titleNode) cell.appendChild(titleNode);
    // Description
    if (descNode) cell.appendChild(descNode);
    // Speakers
    if (speakerImgs.length > 0) {
      const imgWrap = document.createElement('div');
      imgWrap.style.display = 'flex';
      imgWrap.style.gap = '4px';
      speakerImgs.forEach(img => {
        imgWrap.appendChild(img);
      });
      imgWrap.style.marginBottom = '0.5em';
      cell.appendChild(imgWrap);
    }
    if (speakerCountSpan) {
      const countNode = document.createElement('p');
      countNode.textContent = speakerCountSpan.textContent.trim();
      countNode.style.fontWeight = 'bold';
      countNode.style.textTransform = 'uppercase';
      cell.appendChild(countNode);
    }
    return cell;
  });

  const headerRow = ['Columns (columns49)'];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
