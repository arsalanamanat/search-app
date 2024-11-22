# Seach Applicatin Challenge

## Overview
This is a Vue.js application built to fulfill an autocomplete challenge. The app features two autocomplete fields: one for searching cities and another for searching books. The results update dynamically based on user input, with robust handling for edge cases like no results or insufficient characters entered.

## Tech Stack

1. Frontend Framework: Vue.js 3 (Composition API)
2. State Management: Pinia
3. Language: TypeScript for type safety and robust development
4. Cypress And Vitest

## Folder Structure
```

cypress/
├── e2e/  
│   ├── searchAppTest.cy.ts  # End to end test  
src/
├── components/
│   ├── Autocomplete/ 
│   │    ├── Autocomplete.vue      # Main autocomplete component
│   │    ├── style.css             
│   ├── SearchResults/ 
│   │    ├── SearchResults.vue      # Component to display search results
│   │    ├── style.css             
├── store/
│   └── useSearchStore.ts     # Pinia store for managing state
├── data.ts/                  # Dataset of cities and books            
├── tests/
│   ├── Autocomplete.spec.ts  # Unit tests for Autocomplete component
├── App.vue                   # Main app component
├── main.ts                   # Entry point for the app

```
## Setup & Installation 

### 1. Clone the Reporitory
```bash 
git clone https://github.com/your-usernameue-autocomplete-challenge.git

cd vue-autocomplete-challenge
```

### 2. Install dependencies
```bash 
npm install
```

### 3. Run development server
```bash 
npm run dev
```

### 4. Open in browser [click](http://localhost:5173/)


### 5. To run the Unit test 
```bash 
npm run test:unit
```

### 6. To run the end-to-end test 
```bash 
npm run test:e2e
```

### 7. To build the project
```bash 
npm run build
```

## Usage
- Start typing in the City Search or Book Search field.
- Results will appear below the input field when at least 3 characters are - entered.
- If no results match the input, a "No results found" message will be - displayed.
- Clear the input field to reset the results.


## Improvements
- Storybook: Used for component isolation, enhancing reliability and speeding up development.
- Testing Best Practices: Replace HTML attributes with data-cy or testId for Cypress testing.
- Error Handling: Add try-catch blocks for asynchronous operations in real database/API scenarios.
- UI Enhancements: Improve styling for a more polished user experience

