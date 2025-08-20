/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example precisely
  const headerRow = ['Hero (hero70)'];

  // --- Row 2: Background image ---
  // Extract the background-image from the 'header-subnav--container' style
  let backgroundImgCell = '';
  const container = element.querySelector('.header-subnav--container');
  if (container) {
    const bgStyle = container.style.backgroundImage;
    const match = bgStyle.match(/url\(([^)]+)\)/);
    if (match && match[1]) {
      const url = match[1].replace(/"/g, '').trim();
      if (url) {
        // Create an <img> referencing this url
        const img = document.createElement('img');
        img.src = url;
        backgroundImgCell = img;
      } else {
        backgroundImgCell = '';
      }
    } else {
      backgroundImgCell = '';
    }
  }

  // --- Row 3: Content (title, subheading, call-to-action) ---
  const contentCellItems = [];
  // The main content is inside '.header-subnav--item'
  const item = element.querySelector('.header-subnav--item');
  if (item) {
    // Title (Heading)
    const title = item.querySelector('h1');
    if (title) contentCellItems.push(title);

    // Subheading or paragraph
    const textDiv = item.querySelector('.text');
    if (textDiv) contentCellItems.push(textDiv);

    // CTA: If there's a video, convert to a link as per requirements
    const videoEmbedMedia = item.querySelector('.video-embed__media a');
    if (videoEmbedMedia && videoEmbedMedia.hasAttribute('data-videoid')) {
      // Build the video link
      const accountId = videoEmbedMedia.getAttribute('data-accountid');
      const videoId = videoEmbedMedia.getAttribute('data-videoid');
      let videoUrl = '';
      if (accountId && videoId) {
        videoUrl = `https://players.brightcove.net/${accountId}/default_default/index.html?videoId=${videoId}`;
      }
      if (videoUrl) {
        // Try to find play button text
        let buttonText = 'Play Video';
        const playTextSpan = videoEmbedMedia.querySelector('.video-embed__play-text');
        if (playTextSpan && playTextSpan.textContent.trim()) {
          buttonText = playTextSpan.textContent.trim();
        }
        // Create a link element
        const ctaLink = document.createElement('a');
        ctaLink.href = videoUrl;
        ctaLink.textContent = buttonText;
        ctaLink.target = '_blank';
        ctaLink.rel = 'noopener';
        contentCellItems.push(ctaLink);
      }
    }
  }

  // Edge case: If all are missing, leave cell empty
  const contentCell = contentCellItems.length ? contentCellItems : [''];

  // Compose the final block table as per example: 1 col, 3 rows
  const cells = [
    headerRow,
    [backgroundImgCell],
    [contentCell]
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
