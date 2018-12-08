'use strict';

/* global $ */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  displayUnchecked: false,
  searchTerm: ''
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      ${itemTitle}
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  let items = [ ...STORE.items ];
  if (STORE.displayUnchecked) {
    items = items.filter(item => !item.checked);
  }
  if (STORE.searchTerm) {
    items = items.filter(item => item.name.includes(STORE.searchTerm));
  }
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteClickedItem(itemIndex) {
  console.log('Deleting item at index ' + itemIndex);
  delete STORE.items[itemIndex];
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteClickedItem(itemIndex);
    renderShoppingList();
  });
}
function toggleCheck() {
  STORE.displayUnchecked = !STORE.displayUnchecked;
}

function checkBoxHandler() {
  $('js-filter-checked').click(() => {
    toggleCheck();
    renderShoppingList();
  })
}

function setSearch(value) {
  STORE.searchTerm = value;
}

function handleSearch() {
  //this function will be responsible for the search bar
  //which will allow the user to search items on their list
  $('.js-search-item-entry').on('submit', event => {
    const value = $(event.currentTarget).val();
    setSearch(value);
    renderShoppingList();
  });
}

function editItem(name, itemName) {
  const item = store.items.find(item => item.name === name);
  item.name = itemName;
}

/*function handleEdit() {
    //this function will be responsible to allow to user to edit the list
}
//}
// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
*/function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  checkBoxHandler();
  handleSearch();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);