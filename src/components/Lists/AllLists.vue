<template>
  <div id="all-lists">
    <p v-for="l in lists" :key="l.id">
      <my-list
        :id="l.id"
        :name="l.name"
        :items="l.items"
      >
      </my-list>
    </p>
    <p>
      <input type="text" placeholder="Enter new List" @keyup.enter="createList" :style="{width: '100%'}">
    </p>
  </div>
</template>

<script>
import {eventBus} from '../../main';
import MyList from './MyList.vue';
export default {
  props: ['lists'],
  methods: {
    createList(event) {
      eventBus.$emit('createList', {name: event.target.value});
      event.target.value = "";
    },
  },
  components: {
    myList: MyList,
  },
}
</script>

<style scoped>
  .selected {background: lightblue}
</style>
