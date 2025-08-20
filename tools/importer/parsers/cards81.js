/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Cards (cards81)'];
  const rows = [];

  // Get all card blocks
  const cards = element.querySelectorAll(':scope > .reading');

  cards.forEach(card => {
    // IMAGE (first cell)
    let img = null;
    const imageContainer = card.querySelector('.reading__image');
    if (imageContainer) {
      img = imageContainer.querySelector('img'); // Reference the original img element
    }

    // TEXT CONTENT (second cell)
    const textCell = document.createElement('div');
    // 1. Title (as heading, bold)
    const titleHeading = card.querySelector('.reading__title h1, .reading__title h2, .reading__title h3, .reading__title h4, .reading__title h5, .reading__title h6');
    if (titleHeading) {
      // Use only the link's text, style as <strong> to match example
      const link = titleHeading.querySelector('a');
      if (link) {
        const strong = document.createElement('strong');
        strong.textContent = link.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
      }
    }
    // 2. Meta info (Featured, min read)
    const dateMeta = card.querySelector('.reading__date-read');
    if (dateMeta) {
      const spans = dateMeta.querySelectorAll('span');
      const texts = Array.from(spans).map(e => e.textContent.trim()).filter(Boolean);
      if (texts.length) {
        const metaSmall = document.createElement('small');
        metaSmall.textContent = texts.join(' · ');
        textCell.appendChild(metaSmall);
        textCell.appendChild(document.createElement('br'));
      }
    }
    // 3. Tags (if present)
    const tags = Array.from(card.querySelectorAll('.reading__tags .tag'));
    if (tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tags.forEach((tag, i) => {
        tagsDiv.appendChild(tag); // Move the original tag element
        if (i !== tags.length - 1) {
          tagsDiv.appendChild(document.createTextNode(' '));
        }
      });
      textCell.appendChild(tagsDiv);
    }

    // Remove trailing <br> if last element
    while (textCell.lastChild && textCell.lastChild.tagName === 'BR') {
      textCell.removeChild(textCell.lastChild);
    }

    rows.push([
      img || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
