/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This feature will mark or hide specified users in the Marketplace.
 *
 * The script is initiated with the code that follows the `DOM manipulation` comment block.
 *
 * 1.) The URL is examined to see if the user is in the marketplace.
 * 2.) localStorage is queried for a `blockList` item.
 * 3.) If there is a `blockList` and a URL match the script will either mark or hide the
 * specified user(s) (depending on the string value of `blockList.hide`) via CSS class.
 */

rl.ready(() => {

  // ========================================================
  // Functions
  // ========================================================
  /**
   * Find all instances of sellers in list and hide them
   *
   * @method blockSellers
   * @param {String} type Either 'hide' or 'tag'
   * @param {String} querySelector Either 'marketplaceQuerySelector' or 'wantlistMessageQuerySelector' const
   * @param {String} tag Either 'a' (anchor) or 'strong' tag
   * @param {String} clazz Either 'shortcut_navigable' (marketplace) or 'wantlist-card' (wantlist message)
   * @return {function}
   */

  window.blockSellers = function blockSellers(type, querySelector) {

    let _class = type === 'hide' ? 'hidden-seller' : 'blocked-seller',
        tag,
        clazz;

    if (querySelector === marketplaceQuerySelector) {
      tag = 'li';
      clazz = '.shortcut_navigable';
    } else {
      tag = 'strong';
      clazz = '.wantlist-card';
    }

    blockList.list.forEach(seller => {

      let sellerNames = document.querySelectorAll(querySelector);

      sellerNames.forEach(name => {

        if ( name.textContent.trim() === seller
          && !name.closest(tag).querySelector('.de-blocked-seller-icon') ) {

          let icon = document.createElement('span');
          icon.className = 'de-blocked-seller-icon needs_delegated_tooltip';
          icon.dataset.placement = 'bottom';
          icon.rel = 'tooltip';
          icon.title = `${seller} is on your Blocked Seller list.`;

          name.closest(clazz).classList.add(_class);
          name.closest(tag).insertAdjacentElement('beforeend', icon);
        }
      });
    });
  };

  // ========================================================
  // DOM manipulation
  // ========================================================
  let blockList = rl.getPreference('blockList'),
      type,
      marketplaceQuerySelector =  'td.seller_info ul li:first-child a',
      wantlistMessageQuerySelector = 'table.wantlist-card tbody tr:last-child td table tbody tr td table:last-child tbody tr td a strong';

  if ( blockList ) {

    switch ( blockList.hide ) {

      // Hide sellers in the Marketplace and on release sale pages
      // ---------------------------------------------------------------------------
      case 'global':

        if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {
          type = 'hide';
          window.blockSellers(type, marketplaceQuerySelector);

        } else if ( rl.pageIs('messages') ) {
          type = 'hide';
          window.blockSellers(type, wantlistMessageQuerySelector);
        }
        break;

      // Hide sellers in the Marketplace only (marked in red elsewhere)
      // ---------------------------------------------------------------------------
      case 'marketplace':

        if ( rl.pageIs('myWants') ) {
          type = 'hide';
          window.blockSellers(type, marketplaceQuerySelector);

        } else if ( rl.pageIs('allItems', 'seller', 'sellRelease') ) {
          type = 'tag';
          window.blockSellers(type, wantlistMessageQuerySelector);
        }
        break;

      // Mark sellers in red everywhere
      // ---------------------------------------------------------------------------
      case 'tag':

        if ( rl.pageIs('allItems', 'seller', 'sellRelease', 'myWants') ) {
          type = 'tag';
          window.blockSellers(type, marketplaceQuerySelector);

        } else if ( rl.pageIs('messages') ) {
          type = 'tag';
          window.blockSellers(type, wantlistMessageQuerySelector);
        }
        break;
    }

    rl.handlePaginationClicks(window.blockSellers, type, marketplaceQuerySelector);
  }
});
/**
// ========================================================
I am the wizard, the (hush) awkward hawk-eyed wizard
Whose melancholy state of stubborn shows him the hard place
Up close and conjures a lucid quandary
The dreamiest paranoia
Where's the rock, the rock, I wanna fix the rock
Talk it into being my pal
Better yet, my indolent solid-stood apprentice
But thanks, but no thanks but, there is no rock
https://www.discogs.com/master/view/58623
// ========================================================
 */
