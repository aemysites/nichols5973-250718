/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slides container
  const slidesList = element.querySelector('ul.glide__slides');
  if (!slidesList) return;

  // Get all direct li children that are slides (ignore clones)
  const slides = Array.from(slidesList.children).filter(li =>
    li.classList.contains('podcast-carousel') &&
    li.classList.contains('glide__slide') &&
    !li.classList.contains('glide__slide--clone')
  );

  // Build table rows
  const rows = [];
  // Header row as per spec
  const headerRow = ['Carousel (carousel24)'];
  rows.push(headerRow);

  slides.forEach(slide => {
    // Image: the first img in the slide (not the host avatars)
    const mainImg = slide.querySelector(':scope > img');
    if (!mainImg) return;

    // Text content cell
    const contentCell = document.createElement('div');
    contentCell.className = 'carousel24-textcell';

    // Featured podcast label (optional)
    const small = slide.querySelector('.podcast-carousel--txt small');
    if (small) {
      const smallAnchor = small.querySelector('a');
      if (smallAnchor) {
        const smallEl = document.createElement('div');
        smallEl.appendChild(smallAnchor.cloneNode(true));
        contentCell.appendChild(smallEl);
      } else {
        const smallEl = document.createElement('div');
        smallEl.textContent = small.textContent;
        contentCell.appendChild(smallEl);
      }
    }

    // Title (h2)
    const h2 = slide.querySelector('.podcast-carousel--txt h2');
    if (h2) {
      const h2Anchor = h2.querySelector('a');
      if (h2Anchor) {
        const h2El = document.createElement('h2');
        h2El.appendChild(h2Anchor.cloneNode(true));
        contentCell.appendChild(h2El);
      } else {
        const h2El = document.createElement('h2');
        h2El.textContent = h2.textContent;
        contentCell.appendChild(h2El);
      }
    }

    // Hosted By section (optional)
    const hostedBy = slide.querySelector('.podcast-carousel--hosted-by');
    if (hostedBy) {
      // Clone hostedBy
      const hostedByClone = hostedBy.cloneNode(true);
      // For each hoster, add the avatar image and name
      hostedByClone.querySelectorAll('.hoster').forEach(hoster => {
        // Only keep the avatar image and hoster name
        const hosterDiv = document.createElement('div');
        hosterDiv.className = 'carousel24-hoster';
        // Avatar image
        const avatarImg = hoster.querySelector('img');
        if (avatarImg) {
          hosterDiv.appendChild(avatarImg.cloneNode(true));
        }
        // Host name
        const hostName = hoster.querySelector('.hoster-name');
        if (hostName) {
          hosterDiv.appendChild(hostName.cloneNode(true));
        }
        // Replace hoster with hosterDiv
        hoster.replaceWith(hosterDiv);
      });
      contentCell.appendChild(hostedByClone);
    }

    // Add row: [image, text cell]
    rows.push([mainImg, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
