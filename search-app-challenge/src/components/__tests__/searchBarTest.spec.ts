import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils';
import SearchBar from '../AutoComplete/AutoComplete.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '../../stores/searchStore'; // Adjust the path to your store file
import { vi } from 'vitest'



describe('useSearchStore', () => {

  let searchStore: ReturnType<typeof useSearchStore>;

  beforeEach( async () => {

    const { useSearchStore } = await import('../../stores/searchStore');
    vi.resetModules();
    setActivePinia(createPinia())
    searchStore = useSearchStore();

  });


  it('renders search box with header and input field', () => {
    const wrapper = mount(SearchBar, {
      props: { searchCategory: 'cities' }
    });

    expect(wrapper.find('h1').text()).toBe('Search cities');
    const inputField = wrapper.find('.search-input');
    expect(inputField.exists()).toBe(true);
  });


  it('Renders the book search component', () => {
    const wrapper = mount(SearchBar, {
      props: { searchCategory: 'books' }
    });
    expect(wrapper.find('h1').text()).toBe('Search books');
    const inputField = wrapper.find('.search-input');
    expect(inputField.exists()).toBe(true);
  })

  it('displays a warning message if searchQuery length is less than MINIMUM_QUERY_LENGTH', async () => {
    const wrapper = mount(SearchBar, {
      props: { searchCategory: 'cities' }
    });
    const inputField = wrapper.find('.search-input');
    await inputField.setValue('ab'); 
    const warningMessage = wrapper.find('.is-warning');
    expect(warningMessage.exists()).toBe(true);
    expect(warningMessage.text()).toBe('At least 3 are required to complete the search!');
  });

  it('does not display a warning message if searchQuery length is equal to or greater than MINIMUM_QUERY_LENGTH', async () => {
    const wrapper = mount(SearchBar, {
      props: { searchCategory: 'cities' }
    });
    const inputField = wrapper.find('.search-input');
    await inputField.setValue('abc');
    const warningMessage = wrapper.find('.is-warning');
    expect(warningMessage.exists()).toBe(false);
  });
})

