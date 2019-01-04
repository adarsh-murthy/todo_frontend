export const backendService = {
  getAllLists: {method: 'GET', url: 'lists/'},
  createNewList: {method: 'POST', url: 'lists/'},
  updateList: {method: 'PUT', url: 'lists/{listId}/'},
  deleteList: {method: 'DELETE', url: 'lists/{listId}/'},
  getListItems: {method: 'GET', url: 'lists/{listId}/items/'},
  createListItem: {method: 'POST', url: 'lists/{listId}/items/'},
  updateListItem: {method: 'PUT', url: 'lists/{listId}/items/{itemId}/'},
  deleteListItem: {method: 'DELETE', url: 'lists/{listId}/items/{itemId}/'}
}
