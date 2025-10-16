/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card elements
  const cards = Array.from(element.querySelectorAll('.insight'));

  // Block header row
  const headerRow = ['Cards (cards119)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // --- IMAGE CELL ---
    const imageCell = document.createElement('div');
    const imageLink = card.querySelector('.insight__image a');
    if (imageLink) {
      // Only use the main image (not icons)
      const imgs = Array.from(imageLink.querySelectorAll('img'));
      const mainImg = imgs.find(img => img.src && !img.src.startsWith('data:image/svg+xml'));
      if (mainImg) imageCell.appendChild(mainImg.cloneNode(true));
      // Add play button overlay if present
      const playIcon = imageLink.querySelector('.play img');
      if (playIcon) {
        imageCell.appendChild(playIcon.cloneNode(true));
      }
      // Add the 'Podcast: Redefiners' label
      const typeLabel = imageLink.querySelector('.insight__type span');
      if (typeLabel) {
        const labelDiv = document.createElement('div');
        labelDiv.textContent = typeLabel.textContent;
        imageCell.appendChild(labelDiv);
      }
    }

    // --- TEXT CELL ---
    const textCell = document.createElement('div');

    // Authors (avatars and names) - get all speakers and their names
    const speakersBlock = card.querySelector('.insight__authors.speakers');
    if (speakersBlock) {
      // Get all .speaker elements
      const speakerDivs = Array.from(speakersBlock.querySelectorAll('.speaker'));
      speakerDivs.forEach(speaker => {
        // avatar
        const img = speaker.querySelector('img');
        if (img) textCell.appendChild(img.cloneNode(true));
        // name: look for a span sibling right after the speaker div
        let name = '';
        let next = speaker.nextSibling;
        while (next && (next.nodeType !== Node.ELEMENT_NODE || next.tagName !== 'SPAN')) {
          next = next.nextSibling;
        }
        if (next && next.nodeType === Node.ELEMENT_NODE && next.tagName === 'SPAN') {
          name = next.textContent.trim();
        }
        // fallback: span inside speaker
        if (!name) {
          const span = speaker.querySelector('span');
          if (span) name = span.textContent.trim();
        }
        if (name) {
          const authorSpan = document.createElement('span');
          authorSpan.textContent = name;
          textCell.appendChild(authorSpan);
        }
      });
      // Also, if there are direct spans inside speakersBlock (not inside .speaker), add them
      Array.from(speakersBlock.children).forEach(child => {
        if (child.tagName === 'SPAN') {
          const authorSpan = document.createElement('span');
          authorSpan.textContent = child.textContent.trim();
          textCell.appendChild(authorSpan);
        }
      });
    }

    // Date and duration
    const dateBlock = card.querySelector('.insight__date-read');
    if (dateBlock) {
      const dateSpans = Array.from(dateBlock.querySelectorAll('span'));
      if (dateSpans.length) {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = dateSpans.map(s => s.textContent).join(' | ');
        textCell.appendChild(dateDiv);
      }
    }

    // Title (as heading)
    const titleBlock = card.querySelector('.insight__title .heading3 a');
    if (titleBlock) {
      const heading = document.createElement('strong');
      heading.appendChild(titleBlock.cloneNode(true));
      textCell.appendChild(heading);
    }

    // Tags
    const tagsBlock = card.querySelector('.insight__tags');
    if (tagsBlock && tagsBlock.children.length) {
      const tagsDiv = document.createElement('div');
      Array.from(tagsBlock.querySelectorAll('a')).forEach(tag => {
        tagsDiv.appendChild(tag.cloneNode(true));
      });
      textCell.appendChild(tagsDiv);
    }

    // --- FLEXIBLE TEXT EXTRACTION ---
    // Collect all visible text from the left column (excluding tags, authors, date, and title)
    // We'll use all text nodes inside .insight__content, but skip those already handled
    const contentBlock = card.querySelector('.insight__content');
    if (contentBlock) {
      // Exclude nodes already handled
      const handledNodes = [
        card.querySelector('.insight__authors.speakers'),
        card.querySelector('.insight__date-read'),
        card.querySelector('.insight__title'),
        card.querySelector('.insight__tags')
      ].filter(Boolean);
      // Get all text nodes not inside handledNodes
      function getTextNodes(node) {
        let texts = [];
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            texts.push(child.textContent.trim());
          } else if (child.nodeType === Node.ELEMENT_NODE && !handledNodes.includes(child)) {
            texts = texts.concat(getTextNodes(child));
          }
        });
        return texts;
      }
      const extraTexts = getTextNodes(contentBlock);
      if (extraTexts.length) {
        const descDiv = document.createElement('div');
        descDiv.textContent = extraTexts.join(' ');
        textCell.appendChild(descDiv);
      }
    }

    rows.push([
      imageCell,
      textCell
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
