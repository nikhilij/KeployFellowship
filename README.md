# Keploy Fellowship API Server

This is a simple API server built with Node.js, Express, and MongoDB (Mongoose). It provides CRUD operations for a `Book` resource.

## Features
- **Custom API**: 4 endpoints for managing books (Create, Read, Update, Delete)
- **Database**: MongoDB Atlas cluster
- **Tested**: Example curl commands provided

## Setup & Run

### 1. Install dependencies
```
cd server
npm install
```

### 2. Configure Environment
Create a `.env` file in the `server` directory (already provided):
```
MONGODB_URI=mongodb+srv://developernikhilsoni973:3wcWtTwF9lcKw7OJ@cluster0.8fbif.mongodb.net/?retryWrites=true&w=majority
PORT=5000
```

### 3. Start the server
```
npm start
```

Server will run on `http://localhost:5000`.

## API Endpoints

### 1. Create a Book
- **Endpoint:** `POST /api/books`
- **Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "publishedYear": 2024
}
```
- **Sample curl:**
```
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Book Title","author":"Author Name","publishedYear":2024}'
```

### 2. Get All Books
- **Endpoint:** `GET /api/books`
- **Sample curl:**
```
curl http://localhost:5000/api/books
```

### 3. Update a Book
- **Endpoint:** `PUT /api/books/:id`
- **Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "publishedYear": 2025
}
```
- **Sample curl:**
```
curl -X PUT http://localhost:5000/api/books/<BOOK_ID> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","author":"Updated Author","publishedYear":2025}'
```

### 4. Delete a Book
- **Endpoint:** `DELETE /api/books/:id`
- **Sample curl:**
```
curl -X DELETE http://localhost:5000/api/books/<BOOK_ID>
```

## Database
- **Type:** MongoDB Atlas
- **Connection:** Provided in `.env` as `MONGODB_URI`

## How to Test
Use the provided curl commands to test each endpoint after starting the server.

---

Feel free to extend this API or add a frontend as needed!
