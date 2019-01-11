<template>
  <div id="items">
    <p>
      <input type="text" placeholder="Enter new todo" @keyup.enter="createItem" :style="{width: '100%'}">
    </p>
    <div id="todo-items">
      <my-item
        v-for="item in currentItems"
        :key="item.id"
        :id="item.id"
        :is_complete="item.is_complete"
        :summary="item.summary"
        :description="item.description"
        :priority="item.priority"
        v-if="!item.is_complete"
      >
      </my-item>
    </div>
    <div id="completed-items-tab" v-if="isCompletePresent()">
      <button id="completed-button" type="button" class="btn btn-lg btn-block" @click="hideCompleted = !hideCompleted">Completed Items</button>
      <div id="completed-items" v-if="!hideCompleted">
        <my-item
          v-for="item in currentItems"
          :key="item.id"
          :id="item.id"
          :is_complete="item.is_complete"
          :summary="item.summary"
          :description="item.description"
          :priority="item.priority"
          v-if="item.is_complete"
        >
        </my-item>
      </div>
    </div>
    <div class="footer">
      <button class="btn btn-light" @click="sortPriority">Sort</button>
    </div>
  </div>
</template>

<script>
import MyItem from './MyItem.vue';
import {eventBus} from '../../main';
export default {
  props: ['currentItems'],
  data() {
    return {
      hideCompleted: true,
      shouldSort: false,
    }
  },
  components: {
    myItem: MyItem,
  },
  methods: {
    sortPriority() {
      console.log('sort')
      this.currentItems.sort((a, b) => b.priority - a.priority );
    },
    isCompletePresent() {
      var isComplete = false;
      this.currentItems.forEach(function(element) {
        if (element.is_complete) {
          isComplete = true;
        }
      }, this);
      return isComplete;
    },
    createItem(event) {
      eventBus.$emit('createItem', {summary: event.target.value})
    },
  },
}
</script>

<style scoped>
  #todo-items {
    width: 100%;
  }
  #completed-items {
    width: 100%;
  }
  #completed-items-tab div {
    background: lightgray;
  }
  #completed-items-tab input [name="description"] {
    background: lightgray;
  }
  #completed-items-tab label {
    text-decoration: line-through;
  }
  #completed-button {
    background-color: whitesmoke;
  }
  #completed-items-tab button [name="info"] {
    background: lightgray;
  }
  .footer {
    position: fixed;
    bottom: 0;
    right: 35%;
    height: 50px;
}
</style>
