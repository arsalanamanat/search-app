<script setup lang="ts">

import { ref, computed } from 'vue'
import { SEARCH_CATEGORIES } from '../../data';
import DisplayResult from '../DisplayResult/DisplayResult.vue'
import { useSearchStore } from '../../stores/searchStore'

const store = useSearchStore();
const searchQuery = ref('')

const { searchCategory } = defineProps({
  searchCategory: {
    type: String,
    required: true,
  },
})

/**
 * Handles search input and calls store to search for data
 */
const handleInput = () => {
  store.searchData(searchQuery.value, searchCategory)
}

const results = computed(() => searchCategory === SEARCH_CATEGORIES.CITIES ? store.cityResults : store.bookResults);

</script>

<template>
  <div class="search-box">
    <h1>Search {{ searchCategory }} </h1>
    <form class="search-bar">
      <input class="search-input" type="text" @input="handleInput" v-model="searchQuery" autofocus id="search"/>
      <p v-if="searchQuery && searchQuery.length < store.MINIMUM_QUERY_LENGTH" class="is-warning">At least {{
        store.MINIMUM_QUERY_LENGTH }} are required to complete the search!</p>
    </form>
    <DisplayResult :results :searchQuery/>
  </div>
</template>

<style scoped>
@import url(./style.css);
</style>
