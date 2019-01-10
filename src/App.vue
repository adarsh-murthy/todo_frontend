<template>
  <div class="container">
    <h1 align="center">Do It Today!</h1>
    <div id="all-lists" class="container col-xs-6 col-sm-3">
      <all-lists :lists="lists"></all-lists>
    </div>
    <div class="container col-xs-6 col-sm-9" v-if="currentList">
      <all-items :currentItems="currentItems"></all-items>
    </div>
  </div>
</template>

<script>
import AllLists from './components/Lists/AllLists.vue';
import AllItems from './components/Items/AllItems.vue';
import {eventBus} from './main';
import {backendService} from './Actions';

export default {
  data: function() {
    return {
      lists: [],
      currentList: null,
      currentItems: null,
      resource: this.$resource('', {}, backendService),
    }
  },
  components: {
    allItems: AllItems,
    allLists: AllLists,
  },
  methods: {
    loadAllContent() {
      this.resource.getAllLists()
        .then(response => {
            return response.json();
          })
        .then(data => {
          this.lists = data;
          this.lists.forEach(function(element) {
            element.items = [];
            this.resource.getListItems({listId: element.id})
              .then(response => {
                return response.json();
              })
              .then(data => {
                element.items = data;
              })
          }, this);
        });
    },
  },
  created() {
    this.loadAllContent();
    eventBus.$on('selectList', (listId) => {
      this.lists.forEach(function(element) {
        if (element.id === listId) {
          this.currentList = element;
          this.currentItems = element.items;
        };
      }, this);
    });
    eventBus.$on('createList', (data) => {
      this.resource.createNewList({}, data)
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.selected = false;
          data.items = [];
          this.lists.push(data);
        })
    })
    eventBus.$on('deleteList', (listId) => {
      if (this.currentList && this.currentList.id === listId) {
        this.currentList.selected = false;
        this.currentItems = [];
      };
      this.lists.forEach(function(element){
        if (element.id === listId) {
          this.resource.deleteList({listId: listId})
            .then(response => {
              this.lists.splice(this.lists.indexOf(element), 1 );
            })
        }
      }, this);
    });
    eventBus.$on('deleteItem', (itemId) => {
      this.currentItems.forEach(function(element) {
        if (element.id === itemId) {
          this.resource.deleteListItem({listId: this.currentList.id, itemId: itemId})
            .then(response => {
              this.currentItems.splice(this.currentItems.indexOf(element), 1);
            })
        }
      }, this);
    });
    eventBus.$on('completeItem', (itemId) => {
      this.currentItems.forEach(function(element) {
        if (element.id === itemId) {
          this.resource.updateListItem({listId: this.currentList.id, itemId: itemId}, {summary: element.summary, is_complete: !element.is_complete})
            .then(response => {
              return response.json();
            })
            .then(responseData => {
              element.is_complete = !element.is_complete;
            })
        };
      }, this);
    });
    eventBus.$on('updateItemDescription', (data) => {
      this.currentItems.forEach(function(element) {
        if (element.id === data.id) {
          this.resource.updateListItem({listId: this.currentList.id, itemId: element.id}, {summary: element.summary, description: data.description})
            .then(response => {
              return response.json();
            })
            .then(responseData => {
              element.description = data.description;
            })
        }
      }, this);
    });
    eventBus.$on('updateItemSummary', (data) => {
      this.currentItems.forEach(function(element) {
        if (element.id === data.id) {
          this.resource.updateListItem({listId: this.currentList.id, itemId: element.id}, {summary: data.summary})
            .then(response => {
              return response.json();
            })
            .then(responseData => {
              element.summary = data.summary;
            })
        }
      }, this);
    });
    eventBus.$on('renameListName', (data) => {
      this.lists.forEach(function(element) {
        if (element.id === data.id) {
          this.resource.updateList({listId: data.id}, {name: data.newName})
            .then(response => {
              return response.json();
            })
            .then(responseData => {
              element.name = responseData.name;
            })
        };
      }, this);
    });
    eventBus.$on('createItem', (data) => {
      this.resource.createListItem({listId: this.currentList.id}, {summary: event.target.value})
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          this.currentItems.unshift(responseData);
        })
      event.target.value = "";
    });
    eventBus.$on('updateItemPriority', (data) => {
      this.resource.updateListItem({
        listId: this.currentList.id,
        itemId: data.id,
        },
        {
          summary: data.summary,
          priority: data.priority,
        })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          this.currentItems.forEach(function(element) {
            if (element.id === data.id) {
              element.priority = data.priority;
            }
          }, this);
        })
    })
  },
}
</script>

<style>
  h1 { color: brown; font-family: "Great Vibes", cursive; font-size: 80px; line-height: 60px; font-weight: normal; margin-bottom: 50px; margin-top: 20px; text-align: center; text-shadow: 0 1px 1px #fff; }

  input[type=text] {
    width: 100%;
    padding: 10px;
    margin: 5px auto;
    box-sizing: border-box;
  }
</style>
