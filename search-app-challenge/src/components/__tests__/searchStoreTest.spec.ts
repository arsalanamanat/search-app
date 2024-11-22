import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '../../stores/searchStore'; // Adjust the path to your store file
import { SEARCH_CATEGORIES } from '../../data';
import { vi } from 'vitest'

describe('useSearchStore', () => {

  let searchStore: ReturnType<typeof useSearchStore>;

  beforeEach( async () => {

    // Mock the data in data.ts file to make it separate from business logic
    vi.mock('../../data', () => ({
      cities: ['test city 1', 'test city 2'],
      books: [{ title: 'test 1 book 1', author: 'test 1 author 1' }, { title: 'test 2 book 2', author: 'test 2 author 2' }],
      SEARCH_CATEGORIES: { CITIES: 'cities', BOOKS: 'books' },
    }));

    const { useSearchStore } = await import('../../stores/searchStore');
    vi.resetModules();
    setActivePinia(createPinia())
    searchStore = useSearchStore();

  });

  it('should clear search results if query string is too short', () => {
    searchStore.searchData('sa', SEARCH_CATEGORIES.CITIES);
    expect(searchStore.cityResults).toEqual([]);
    expect(searchStore.bookResults).toEqual([]);
  });

  it('should return city results matching the query string', async () => {
    searchStore.searchData('test', SEARCH_CATEGORIES.CITIES);
    expect(searchStore.cityResults).toEqual([
      'test city 1', 'test city 2'
    ]);
  });


  it('should return book results matching the query string', () => {
    searchStore.searchData('test 1', SEARCH_CATEGORIES.BOOKS);
    expect(searchStore.bookResults).toEqual([
      { title: 'test 1 book 1', author: 'test 1 author 1' },
    ]);
  });
})