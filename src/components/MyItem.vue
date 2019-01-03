<template>
  <div id="item" class="container col-sm-12">
    <input :id="id" type="checkbox" :checked="isComplete" @change="completeItem">
    <label :for="id">{{ itemSummary }}</label>
    <button aria-label="Close Account Info Modal Box" style="float: right; background: #EA5D5D" @click="deleteItem">&#x2717;</button>

    <button class="collapsible fa fa-fw fa-chevron-down" @click="showContent = !showContent" title="Click for more info">&#9432;</button>
    <div class="collapsible-content" v-if="showContent">
      <input type="text" v-model="itemSummary" @keyup.enter="updateItemSummary">
      <textarea v-model="itemDescription" @blur="updateItemDescription" name="description" :id="id" placeholder="description"></textarea>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../main';
export default {
  props: {
    summary: String,
    description: String,
    isComplete: Boolean,
    id: Number,
  },
  data() {
    return {
      showContent: false,
      itemDescription: this.description,
      itemSummary: this.summary,
    }
  },
  methods: {
    deleteItem() {
      eventBus.$emit('deleteItem', this.id);
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
  },
}
</script>

<style scoped>

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
