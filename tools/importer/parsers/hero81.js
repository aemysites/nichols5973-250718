/* global WebImporter */
export default function parse(element, { document }) {
  // --- Step 1: Table header row ---
  const headerRow = ['Hero (hero81)'];

  // --- Step 2: Background image row ---
  // Find the background image from the first <img> inside the block
  let bgImg = element.querySelector('img');
  let bgImgCell = bgImg ? bgImg : '';

  // --- Step 3: Content row ---
  // Find the main content container
  const contentContainer = element.querySelector('.header-subnav--content');
  let contentParts = [];

  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('h1');
    if (heading) contentParts.push(heading);

    // Paragraph/subheading
    const subheading = contentContainer.querySelector('.text');
    if (subheading) contentParts.push(subheading);

    // CTA / Play Video button
    // Look for video embed link (anchor)
    const videoEmbed = contentContainer.querySelector('.video-embed__media a');
    if (videoEmbed) {
      // Try to extract the play button text and icon
      const playWrapper = videoEmbed.querySelector('.video-embed__play');
      if (playWrapper) {
        // Create a new anchor with the same href (if any), but preserve children
        const ctaLink = document.createElement('a');
        // There is no href, but we can use data-videoid or data-accountid for reference
        // Instead, fallback to the video ID as a link (if present)
        const videoId = videoEmbed.getAttribute('data-videoid');
        if (videoId) {
          ctaLink.href = `https://players.brightcove.net/${videoEmbed.getAttribute('data-accountid')}/default_default/index.html?videoId=${videoId}`;
        }
        // Copy the play icon and text
        Array.from(playWrapper.childNodes).forEach((node) => ctaLink.appendChild(node.cloneNode(true)));
        contentParts.push(ctaLink);
      }
    }
  }

  // --- Step 4: Compose table rows ---
  const rows = [
    headerRow,
    [bgImgCell],
    [contentParts]
  ];

  // --- Step 5: Create and replace ---
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
