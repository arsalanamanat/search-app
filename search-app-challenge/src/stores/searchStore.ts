import { ref } from 'vue';
import { defineStore } from 'pinia'
import { cities, books, type City, type Book, SEARCH_CATEGORIES } from '../data';


/**
 * Pinia store for managing search functionality for cities and books.
 */
export const useSearchStore = defineStore('searchStore', () => {

  /**
   * Data set of city. Assuming its fetch from database e.g data.ts file 
   */
    const citiesRecord = ref<City[]>(cities);

  /**
   * Data set of books. Assuming its fetch from database e.g data.ts file 
   */
      const booksRecord = ref<Book[]>(books);

  /**
   * Results of the city search.
   * @type {Ref<City[]>}
   */
  const cityResults = ref<City[]>([]);

  /**
   * Results of the book search.
   * @type {Ref<Book[]>}
   */
  const bookResults = ref<Book[]>([]);

  /**
  * Minimum length of the query string to trigger a search.
  */
  const MINIMUM_QUERY_LENGTH = 3;

  /**
   * Handles searching for cities or books based on the query string and search type.
   * Clears results if the query string is too short.
   * 
   * @param {string} queryString - The user's search query.
   * @param {'cities' | 'books'} searchCategory - Type of search to perform (cities or books).
   */
  const searchData = (queryString: string, searchCategory: string) => {

    if (queryString.length < MINIMUM_QUERY_LENGTH) {
      clearSearchResults();
      return;
    }

    switch (searchCategory) {
      case SEARCH_CATEGORIES.CITIES:
        searchCities(queryString);
        break;
      case SEARCH_CATEGORIES.BOOKS:
        searchBooks(queryString);
        break;
      default:
        console.warn(`Unknown search type: ${searchCategory}`);
        break;
    }
  }

  /**
   * Searches the cities dataset for matches based on the query string.
   * Updates `cityResults` with the results or a message if no matches are found.
   * 
   * @param {string} queryString - The user's search query for cities.
   */
  const searchCities = (queryString: string): void => {
    cityResults.value =  citiesRecord.value.filter((city: City) => city.toLowerCase().includes(queryString.toLowerCase())).sort()
  }

  /**
 * Searches the books dataset for matches based on the query string.
 * Updates `bookResults` with the results or a message if no matches are found.
 * 
 * @param {string} queryString - The user's search query for books.
 */
  const searchBooks = (queryString: string): void => {
    bookResults.value = booksRecord.value.filter((book: Book) => book.title.toLowerCase().includes(queryString.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title));
  }

  /**
   * Clears the search results for both cities and books.
   */
  const clearSearchResults = () => {
    cityResults.value = [];
    bookResults.value = [];
  };

  return { MINIMUM_QUERY_LENGTH, searchData, cityResults, bookResults }
})
