<template>
  <div class="container" :class="{ selected: selected }">
    <h4 v-if="!showRename" :id="id" @click="selectList">{{ name }}</h4>
    <input type="text" v-model="listName" @keyup.enter="updateListName" v-if="showRename">
    <button aria-label="Close Account Info Modal Box" style="float: right; background: #EA5D5D" @click="deleteList">&#x2717;</button>
    <button style="float: right;" @click="renameList">&#9998</button>
    {{ _inactive }}
  </div>
</template>

<script>
import { eventBus } from '../../main';
export default {
  props: ['id', 'name', 'items'],
  data() {
    return {
      showRename: false,
      listName: this.name,
      selected: null,
    };
  },
  methods: {
    deleteList(event) {
      if (confirm('Are you sure you want to delete this list?')) {
        eventBus.$emit('deleteList', this.id)
      }
    },
    selectList(event) {
      eventBus.$emit('selectList', Number(event.target.id));
    },
    renameList() {
      this.showRename = !this.showRename;
    },
    updateListName(event) {
      var data = {
        id: this.id,
        newName: event.target.value,
      }
      eventBus.$emit('renameListName', data);
      this.showRename = false;
    },
  },
  created() {
    eventBus.$on('selectList', listId => {
      if (this.id === listId) {
        this.selected = true;
      } else {
        this.selected = false;
      }
    })
  },
}
</script>

<style scoped>
  .selected {background: lightblue}
  div {
    border: 1px solid #ccc;
    box-shadow: 1px 1px 10px black;
    padding: 10px;
    width: 100%;
  }
</style>

