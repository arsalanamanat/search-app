<script setup lang="ts">

import { defineProps, type PropType } from 'vue'
import { type City, type Book } from '../../data';
import { useSearchStore } from '../../stores/searchStore'

const {MINIMUM_QUERY_LENGTH} = useSearchStore();

const { results } = defineProps({
  results: {
    type: Array as PropType<Book[] | City[]>,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
})

function isBook(result: Book | City): result is Book {
  return (result as Book).title !== undefined;
}
</script>

<template>
  <div>
    <span v-if="searchQuery.length >= MINIMUM_QUERY_LENGTH && results.length === 0 ">No results Found</span>
    <ul v-else="results.length">
      <li v-for="result in results" class="result">
        <span v-if="isBook(result)">{{ result.title }} <small v-if="result.author">{{ result.author }}</small> </span>
        <span v-else>{{ result }} </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import url('./style.css');
</style>
