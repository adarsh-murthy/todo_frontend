<template>
  <div class="container">
    <h1 align="center">Do It Today!</h1>
    <div id="all-lists" class="container col-xs-6 col-sm-3">
      <p v-for="l in lists" :key="l.id">
        <my-list
          :id="l.id"
          :name="l.name"
          :items="l.items"
          :selected="l.selected"
        >
        </my-list>
      </p>
      <p>
        <input type="text" placeholder="Enter new List" @keyup.enter="createList" :style="{width: '100%'}">
      </p>
    </div>
    <div id="currentListItem" class="container col-xs-12 col-sm-9" v-if="currentItems != null">
      <p>
        <input type="text" placeholder="Enter new todo" @keyup.enter="createItem" :style="{width: '100%'}">
      </p>
      <div id="todo-items" class="container">
        <p
          v-for="i in currentItems"
          :key="i.id"
          v-if="!i.is_complete"
        >
          <my-item
            :summary="i.summary"
            :description="i.description"
            :id="i.id"
            :is_complete="i.is_complete"
          >
          </my-item>
        </p>
      </div>
        <div v-if="showCompletedTab" id="completed-items" class="container">
        <h4>Completed</h4>
        <p
          v-for="i in currentItems"
          :key="i.id"
          v-if="i.is_complete"
        >
          <my-item
            :summary="i.summary"
            :description="i.description"
            :id="i.id"
            :is_complete="i.is_complete"
          >
          </my-item>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
import MyList from './components/MyList.vue';
import MyItem from './components/MyItem.vue';
import {eventBus} from './main';
import {backendService} from './Actions';

export default {
  data: function() {
    return {
      lists: [],
      currentList: null,
      lastListId: 4,
      currentItems: null,
      showModal: false,
      showCompletedTab: false,
      resource: this.$resource('', {}, backendService),
    }
  },
  components: {
    myList: MyList,
    myItem: MyItem,
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
            element.selected = false;
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
    createList(event) {
      this.resource.createNewList({}, {name: event.target.value})
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.selected = false;
          data.items = [];
          this.lists.push(data);
        })
      event.target.value = "";
    },
    createItem(event) {
      this.resource.createListItem({listId: this.currentList.id}, {summary: event.target.value})
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          this.currentItems.unshift(responseData);
        })
      event.target.value = "";
    },
    showCompleted() {
      var isCompletePresent = false;
      this.currentItems.forEach(function(element) {
        if (element.is_complete) {
          isCompletePresent = true;
        }
      }, this);
      this.showCompletedTab = isCompletePresent;
    },
  },
  created() {
    this.loadAllContent();
    eventBus.$on('selectList', (listId) => {
      if (this.currentList) {
        this.currentList.selected = false;
      }
      this.lists.forEach(function(element) {
        if (element.id === listId) {
          this.currentList = element;
          this.currentList.selected = true;
          this.currentItems = element.items;
          this.showCompleted();
        };
      }, this);
    });
    eventBus.$on('deleteList', (listId) => {
      if (this.currentList && this.currentList.id === listId) {
        this.currentList.selected = false;
        this.currentItems = [];
        this.showCompleted();
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
              this.showCompleted();
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
              this.showCompleted();
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
  }
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
  #todo-items {
    width: 100%;
  }
  #completed-items {
    width: 100%;
  }
  #completed-items div {
    background: lightgray;
  }
  #completed-items input [name="description"] {
    background: lightgray;
  }
  #completed-items label {
    text-decoration: line-through;
  }

.panel-heading.collapsed .fa-chevron-down,
.panel-heading .fa-chevron-right {
  display: none;
}

.panel-heading.collapsed .fa-chevron-right,
.panel-heading .fa-chevron-down {
  display: inline-block;
}

i.fa {
  cursor: pointer;
  margin-right: 5px;
}

.collapsed ~ .panel-body {
  padding: 0;
}

</style>
