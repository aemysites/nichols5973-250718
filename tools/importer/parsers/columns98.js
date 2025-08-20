/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main container
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // Get the main rich text block
  const richText = layoutContainer.querySelector('.rich-text-basic__text');
  if (!richText) return;

  // Find the stat (right column) cell: inside <table> (align="right")
  let statCell = null;
  const statTable = richText.querySelector('table[align="right"]');
  if (statTable) {
    // Stat content is in the second <td>
    const tds = statTable.querySelectorAll('td');
    if (tds.length > 1) {
      statCell = tds[1];
    }
    // Remove from DOM so it doesn't appear in left column content
    statTable.remove();
  }

  // Left column: all elements in .rich-text-basic__text except the statTable and nav menu
  // Remove nav menu (the first <p> with links)
  const navPara = richText.querySelector('p a.link--button')?.closest('p');
  if (navPara) navPara.remove();

  // Remove empty <p>&nbsp;</p> blocks
  Array.from(richText.querySelectorAll('p')).forEach((p) => {
    if (!p.textContent.trim() || p.innerHTML.trim() === '&nbsp;') p.remove();
  });

  // Now assemble the left column: all remaining direct children (in order)
  const leftChildren = Array.from(richText.childNodes).filter(
    n => {
      // Only Element nodes (not comment/text)
      if (n.nodeType !== 1) return false;
      // Skip any table (should be already removed)
      if (n.tagName === 'TABLE') return false;
      return true;
    }
  );

  // Construct the block table
  const headerRow = ['Columns (columns98)'];
  const columnsRow = [leftChildren, statCell ? [statCell] : []];
  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);

  element.replaceWith(table);
}
