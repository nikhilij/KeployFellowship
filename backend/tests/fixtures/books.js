// Test data fixtures for books
export const validBook = {
   title: "The Great Gatsby",
   author: "F. Scott Fitzgerald",
   publishedYear: 1925,
};

export const anotherValidBook = {
   title: "To Kill a Mockingbird",
   author: "Harper Lee",
   publishedYear: 1960,
};

export const bookWithLongTitle = {
   title: "This is a very long title that should still be valid for testing purposes",
   author: "Test Author",
   publishedYear: 2023,
};

export const invalidBooks = {
   missingTitle: {
      author: "Test Author",
      publishedYear: 2023,
   },
   missingAuthor: {
      title: "Test Title",
      publishedYear: 2023,
   },
   missingYear: {
      title: "Test Title",
      author: "Test Author",
   },
   invalidYear: {
      title: "Test Title",
      author: "Test Author",
      publishedYear: "not a number",
   },
   negativeYear: {
      title: "Test Title",
      author: "Test Author",
      publishedYear: -100,
   },
};

export const booksArray = [
   {
      title: "1984",
      author: "George Orwell",
      publishedYear: 1949,
   },
   {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      publishedYear: 1813,
   },
   {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      publishedYear: 1951,
   },
   {
      title: "Lord of the Flies",
      author: "William Golding",
      publishedYear: 1954,
   },
   {
      title: "Animal Farm",
      author: "George Orwell",
      publishedYear: 1945,
   },
];
