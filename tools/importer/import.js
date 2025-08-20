/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero3Parser from './parsers/hero3.js';
import hero4Parser from './parsers/hero4.js';
import hero9Parser from './parsers/hero9.js';
import columns11Parser from './parsers/columns11.js';
import cards7Parser from './parsers/cards7.js';
import cards2Parser from './parsers/cards2.js';
import hero12Parser from './parsers/hero12.js';
import carousel6Parser from './parsers/carousel6.js';
import accordion16Parser from './parsers/accordion16.js';
import cards17Parser from './parsers/cards17.js';
import columns10Parser from './parsers/columns10.js';
import tabs13Parser from './parsers/tabs13.js';
import cards22Parser from './parsers/cards22.js';
import tabs18Parser from './parsers/tabs18.js';
import columns26Parser from './parsers/columns26.js';
import cards27Parser from './parsers/cards27.js';
import columns8Parser from './parsers/columns8.js';
import columns32Parser from './parsers/columns32.js';
import columns19Parser from './parsers/columns19.js';
import columns33Parser from './parsers/columns33.js';
import cardsNoImages24Parser from './parsers/cardsNoImages24.js';
import accordion25Parser from './parsers/accordion25.js';
import columns37Parser from './parsers/columns37.js';
import carousel35Parser from './parsers/carousel35.js';
import columns40Parser from './parsers/columns40.js';
import columns34Parser from './parsers/columns34.js';
import carousel1Parser from './parsers/carousel1.js';
import tabs20Parser from './parsers/tabs20.js';
import carousel43Parser from './parsers/carousel43.js';
import hero47Parser from './parsers/hero47.js';
import columns50Parser from './parsers/columns50.js';
import carousel52Parser from './parsers/carousel52.js';
import columns36Parser from './parsers/columns36.js';
import cards54Parser from './parsers/cards54.js';
import columns48Parser from './parsers/columns48.js';
import tabs5Parser from './parsers/tabs5.js';
import hero55Parser from './parsers/hero55.js';
import hero56Parser from './parsers/hero56.js';
import cards44Parser from './parsers/cards44.js';
import columns59Parser from './parsers/columns59.js';
import cards58Parser from './parsers/cards58.js';
import hero62Parser from './parsers/hero62.js';
import hero63Parser from './parsers/hero63.js';
import hero64Parser from './parsers/hero64.js';
import hero61Parser from './parsers/hero61.js';
import tabs67Parser from './parsers/tabs67.js';
import columns68Parser from './parsers/columns68.js';
import cards65Parser from './parsers/cards65.js';
import columns69Parser from './parsers/columns69.js';
import accordion71Parser from './parsers/accordion71.js';
import carousel70Parser from './parsers/carousel70.js';
import cards72Parser from './parsers/cards72.js';
import columns41Parser from './parsers/columns41.js';
import cards77Parser from './parsers/cards77.js';
import columns60Parser from './parsers/columns60.js';
import cards14Parser from './parsers/cards14.js';
import carousel79Parser from './parsers/carousel79.js';
import cardsNoImages78Parser from './parsers/cardsNoImages78.js';
import cards80Parser from './parsers/cards80.js';
import accordion82Parser from './parsers/accordion82.js';
import cards81Parser from './parsers/cards81.js';
import carousel83Parser from './parsers/carousel83.js';
import tabs39Parser from './parsers/tabs39.js';
import cards86Parser from './parsers/cards86.js';
import columns85Parser from './parsers/columns85.js';
import columns84Parser from './parsers/columns84.js';
import cards87Parser from './parsers/cards87.js';
import cards88Parser from './parsers/cards88.js';
import cards90Parser from './parsers/cards90.js';
import columns92Parser from './parsers/columns92.js';
import tabs94Parser from './parsers/tabs94.js';
import carousel93Parser from './parsers/carousel93.js';
import tabs57Parser from './parsers/tabs57.js';
import cards96Parser from './parsers/cards96.js';
import cardsNoImages100Parser from './parsers/cardsNoImages100.js';
import carousel101Parser from './parsers/carousel101.js';
import columns53Parser from './parsers/columns53.js';
import cards103Parser from './parsers/cards103.js';
import hero74Parser from './parsers/hero74.js';
import hero29Parser from './parsers/hero29.js';
import hero104Parser from './parsers/hero104.js';
import accordion106Parser from './parsers/accordion106.js';
import cards108Parser from './parsers/cards108.js';
import carousel105Parser from './parsers/carousel105.js';
import cards110Parser from './parsers/cards110.js';
import cards112Parser from './parsers/cards112.js';
import cards113Parser from './parsers/cards113.js';
import tabs114Parser from './parsers/tabs114.js';
import hero91Parser from './parsers/hero91.js';
import tabs116Parser from './parsers/tabs116.js';
import accordion118Parser from './parsers/accordion118.js';
import columns119Parser from './parsers/columns119.js';
import columns95Parser from './parsers/columns95.js';
import cards121Parser from './parsers/cards121.js';
import columns102Parser from './parsers/columns102.js';
import carousel115Parser from './parsers/carousel115.js';
import cards76Parser from './parsers/cards76.js';
import columns98Parser from './parsers/columns98.js';
import columns107Parser from './parsers/columns107.js';
import columns109Parser from './parsers/columns109.js';
import columns75Parser from './parsers/columns75.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero3: hero3Parser,
  hero4: hero4Parser,
  hero9: hero9Parser,
  columns11: columns11Parser,
  cards7: cards7Parser,
  cards2: cards2Parser,
  hero12: hero12Parser,
  carousel6: carousel6Parser,
  accordion16: accordion16Parser,
  cards17: cards17Parser,
  columns10: columns10Parser,
  tabs13: tabs13Parser,
  cards22: cards22Parser,
  tabs18: tabs18Parser,
  columns26: columns26Parser,
  cards27: cards27Parser,
  columns8: columns8Parser,
  columns32: columns32Parser,
  columns19: columns19Parser,
  columns33: columns33Parser,
  cardsNoImages24: cardsNoImages24Parser,
  accordion25: accordion25Parser,
  columns37: columns37Parser,
  carousel35: carousel35Parser,
  columns40: columns40Parser,
  columns34: columns34Parser,
  carousel1: carousel1Parser,
  tabs20: tabs20Parser,
  carousel43: carousel43Parser,
  hero47: hero47Parser,
  columns50: columns50Parser,
  carousel52: carousel52Parser,
  columns36: columns36Parser,
  cards54: cards54Parser,
  columns48: columns48Parser,
  tabs5: tabs5Parser,
  hero55: hero55Parser,
  hero56: hero56Parser,
  cards44: cards44Parser,
  columns59: columns59Parser,
  cards58: cards58Parser,
  hero62: hero62Parser,
  hero63: hero63Parser,
  hero64: hero64Parser,
  hero61: hero61Parser,
  tabs67: tabs67Parser,
  columns68: columns68Parser,
  cards65: cards65Parser,
  columns69: columns69Parser,
  accordion71: accordion71Parser,
  carousel70: carousel70Parser,
  cards72: cards72Parser,
  columns41: columns41Parser,
  cards77: cards77Parser,
  columns60: columns60Parser,
  cards14: cards14Parser,
  carousel79: carousel79Parser,
  cardsNoImages78: cardsNoImages78Parser,
  cards80: cards80Parser,
  accordion82: accordion82Parser,
  cards81: cards81Parser,
  carousel83: carousel83Parser,
  tabs39: tabs39Parser,
  cards86: cards86Parser,
  columns85: columns85Parser,
  columns84: columns84Parser,
  cards87: cards87Parser,
  cards88: cards88Parser,
  cards90: cards90Parser,
  columns92: columns92Parser,
  tabs94: tabs94Parser,
  carousel93: carousel93Parser,
  tabs57: tabs57Parser,
  cards96: cards96Parser,
  cardsNoImages100: cardsNoImages100Parser,
  carousel101: carousel101Parser,
  columns53: columns53Parser,
  cards103: cards103Parser,
  hero74: hero74Parser,
  hero29: hero29Parser,
  hero104: hero104Parser,
  accordion106: accordion106Parser,
  cards108: cards108Parser,
  carousel105: carousel105Parser,
  cards110: cards110Parser,
  cards112: cards112Parser,
  cards113: cards113Parser,
  tabs114: tabs114Parser,
  hero91: hero91Parser,
  tabs116: tabs116Parser,
  accordion118: accordion118Parser,
  columns119: columns119Parser,
  columns95: columns95Parser,
  cards121: cards121Parser,
  columns102: columns102Parser,
  carousel115: carousel115Parser,
  cards76: cards76Parser,
  columns98: columns98Parser,
  columns107: columns107Parser,
  columns109: columns109Parser,
  columns75: columns75Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
