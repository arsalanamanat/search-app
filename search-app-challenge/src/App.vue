<script setup lang="ts">

import AutoComplete from './components/AutoComplete/AutoComplete.vue'
import { SEARCH_CATEGORIES } from './data';

</script>

<template>

  <div class="container">
    <h1>Search Engine Application Challenge</h1>
    <div class="search-container">
      <AutoComplete :searchCategory="SEARCH_CATEGORIES.CITIES" />
      <AutoComplete :searchCategory="SEARCH_CATEGORIES.BOOKS" />
    </div>
  </div>

</template>
