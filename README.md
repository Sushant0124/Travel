# Wanderlust REST API

## Overview

Wanderlust is a REST API built using Node.js, Express, and MongoDB. This API provides endpoints for managing travel listings, allowing users to create, read, update, and delete listings. The purpose of this API is to serve as a backend service for a travel-themed application.

## Features

- **GET**: Retrieve travel listings.
- **POST**: Create new travel listings.
- **PUT**: Update existing travel listings.
- **DELETE**: Delete travel listings.

## Prerequisites

- Node.js
- MongoDB
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

3. Create a `.env` file in the root directory and add your MongoDB URI:
    ```plaintext
    MONGODB_URI=mongodb://localhost:27017/wanderlust
    ```

## Usage

1. Start the server:
    ```bash
    npm start
    ```

2. The API will be available at `http://localhost:3000`.

## Endpoints

### List All Listings

- **URL**: `/listings`
- **Method**: `GET`
- **Success Response**:
    - **Code**: 200
    - **Content**: `[{ listing1 }, { listing2 }, ...]`

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

### Get a Single Listing

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

## Project Structure

```plaintext
wanderlust-api/
├── models/
│   └── Listing.js
├── routes/
│   └── listings.js
├── server.js
├── .env
├── package.json
└── README.md

![image](https://github.com/Sushant0124/WanderLust/assets/142045977/6d11da2d-b802-43cd-b097-14d73e5e8633)

