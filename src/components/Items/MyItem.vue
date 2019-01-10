<template>
  <div id="item" class="container col-sm-12">
    <input :id="id" type="checkbox" :checked="is_complete" @change="completeItem">
    <label :for="id">{{ itemSummary }}</label>
    <button aria-label="Close Account Info Modal Box" style="float: right; background: #EA5D5D" @click="deleteItem">&#x2717;</button>

    <button name="info" class="collapsible" @click="showContent = !showContent" title="Click for more info">&#9432;</button>
    <span class="collapsible star" title="Priority" v-for="x in Number(itemPriority)+1">&#x2605;</span>
    <div class="collapsible-content" v-if="showContent">
      <input name="summary-input" type="text" v-model="itemSummary" @blur="updateItemSummary">
      <textarea v-model="itemDescription" @blur="updateItemDescription" name="description" :id="id" placeholder="description"></textarea>
      <br>
      <label for="priority">Priority</label>
      <select name="priority" :id="id" v-model="itemPriority" @change="updateItemPriority">
        <option value="0">Low</option>
        <option value="1">Medium</option>
        <option value="2">High</option>
      </select>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
export default {
  props: {
    summary: String,
    description: String,
    is_complete: Boolean,
    id: Number,
    priority: Number,
  },
  data() {
    return {
      showContent: false,
      itemDescription: this.description,
      itemSummary: this.summary,
      itemPriority: this.priority,
      buttonColor: this.is_complete ? 'lightgray' : 'white'
    }
  },
  methods: {
    deleteItem() {
      if (confirm('Are you sure you want to delete this item?')) {
        eventBus.$emit('deleteItem', this.id);
      }
    },
    completeItem() {
      eventBus.$emit('completeItem', this.id);
    },
    updateItemSummary() {
      var data = {
        id: this.id,
        summary: this.itemSummary,
      }
      eventBus.$emit('updateItemSummary', data);
    },
    updateItemDescription() {
      var data = {
        id: this.id,
        description: this.itemDescription,
      };
      eventBus.$emit('updateItemDescription', data);
    },
    updateItemPriority() {
      eventBus.$emit('updateItemPriority', {id: this.id, priority: Number(this.itemPriority), summary: this.summary});
    }
  },
}
</script>

<style scoped>
  #priority-stars {
    color: red;
  }

  .star {
    color: red; /* Make it red */
    font-size: 200%; /* Make it twice as large */
  }

  #item {
    border: 1px solid #ccc;
    box-shadow: 1px 1px 2px black;
    padding: 10px;
    margin: 5px auto;
    text-align: left;
  }
  .collapsible {
    cursor: pointer;
    padding: 5px;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
  }
  textarea {
    width: 80%;
  }
</style>
