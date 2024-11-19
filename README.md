
# Wanderlust REST API  

## Overview  

Wanderlust is a REST API built using **Node.js**, **Express**, and **MongoDB**. It provides endpoints for managing travel listings, offering core functionalities like creating, reading, updating, and deleting listings. This API serves as the backend service for a travel-themed application, enabling users to explore and manage travel destinations efficiently.  

## Features  

- **CRUD Operations:**  
  - Retrieve all travel listings or specific ones.  
  - Create new travel destinations with metadata like price, location, and images.  
  - Update existing travel entries dynamically.  
  - Delete outdated or unwanted listings.  
- **Optimized Query Handling:** Efficiently retrieves data using MongoDB’s indexing.  
- **Secure:** Input validation and middleware for error handling.  

## Technology Stack  

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication (Optional):** Passport.js (can be integrated for secure user access)  
- **Environment Configuration:** dotenv  

## Prerequisites  

- Node.js (v14 or later)  
- MongoDB (Local/Cloud URI)  
- npm (Node Package Manager)  

## Installation  

1. Clone the repository:  
    ```bash
    git clone https://github.com/yourusername/wanderlust-api.git
    cd wanderlust-api
    ```  

2. Install dependencies:  
    ```bash
    npm install
    ```  

3. Create a `.env` file in the root directory and configure the MongoDB URI:  
    ```plaintext
    MONGODB_URI=mongodb://localhost:27017/wanderlust
    ```  

## Usage  

1. Start the server:  
    ```bash
    npm start
    ```  

2. Access the API at `http://localhost:3000`.  

## API Endpoints  

### Retrieve All Listings  

- **URL**: `/listings`  
- **Method**: `GET`  
- **Success Response**:  
    - **Code**: 200  
    - **Content**:  
      ```json
      [
        {
          "_id": "64b12f1...",
          "title": "Beach House",
          "description": "Ocean view property.",
          "price": 150,
          "location": "Malibu",
          "country": "USA",
          "image": "url-to-image"
        },
        ...
      ]
      ```  

### Create a New Listing  

- **URL**: `/listings`  
- **Method**: `POST`  
- **Body**:  
    ```json
    {
      "title": "Amazing Beach House",
      "description": "A lovely beach house with ocean views.",
      "price": 150,
      "location": "Malibu",
      "country": "USA",
      "image": "url-to-image"
    }
    ```  
- **Success Response**:  
    - **Code**: 201  
    - **Content**: `{ new listing }`  

### Retrieve a Single Listing  

- **URL**: `/listings/:id`  
- **Method**: `GET`  
- **Success Response**:  
    - **Code**: 200  
    - **Content**: `{ listing }`  

### Update a Listing  

- **URL**: `/listings/:id`  
- **Method**: `PUT`  
- **Body**:  
    ```json
    {
      "title": "Updated Title",
      "description": "Updated Description",
      "price": 200,
      "location": "Updated Location",
      "country": "Updated Country",
      "image": "updated-url-to-image"
    }
    ```  
- **Success Response**:  
    - **Code**: 200  
    - **Content**: `{ updated listing }`  

### Delete a Listing  

- **URL**: `/listings/:id`  
- **Method**: `DELETE`  
- **Success Response**:  
    - **Code**: 204  
    - **Content**: `No Content`  

## Project Details  

- **Cloud Deployment:** The backend is deployed on **Render**, and the frontend is hosted on **Vercel**.  
- **Database Management:** MongoDB is used as the primary database, providing scalability for large datasets.  
- **Middleware Integration:**  
  - Middleware ensures data validation for every request to maintain data integrity.  
  - Error-handling middleware provides meaningful API responses for better debugging.  
- **Payment Integration (Optional):** Can integrate with payment gateways like Razorpay or Stripe to enable transactions for travel bookings.  

## Project Structure  

```plaintext  
wanderlust-api/  
├── models/  
│   └── Listing.js         # Mongoose schema for travel listings  
├── routes/  
│   └── listings.js        # RESTful routes for travel listings  
├── server.js              # Entry point of the application  
├── .env                   # Environment variables  
├── package.json           # Dependencies and scripts  
├── README.md              # Documentation  
```  

## Future Scope  

- Add **user authentication** for managing user-specific listings.  (done)
- Implement **real-time updates** with WebSockets for collaborative trip planning.  
- Integrate a **payment gateway** for secure booking transactions.  (done)
- Enhance search functionality with **Geo-Location APIs** for nearby recommendations.  (done)

---
