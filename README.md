# Movies-Management

## Project-Management of movie booking

### Key points

- This project is divided into 5 features namely Business,User, Movie, Cart and Order.
- /user/:userId are protected paths and require authentication and authorisation

## FEATURE I - Movies

## Movie APIs

### POST /user/:userId/movies

- Used axios to fetch movie's data from omdb-api by name query
- Stored the document in a schemaless fashion inside mongodb
- If movie already present then it is fetched from db as a response

### GET /movies

- Fetched movie details from database
- Selected specific fields to be shown such as- title, year, actors etc.

## FEATURE II - Users

## User APIs

### POST /register

- API for user registration
- Password is saved in encrypted format using bcrypt

### POST /login

- User can login with their email and password.
- JWT token generated with 1hr expiry

### GET /user/:userId

- Fetches user details

### PUT /user/:userId

- Updates users data from request body

### DELETE /user/:userId

- User document is marked deleted

### GET /user/:userId/shows

- User can search business showing the movie by providing movieId and date

### GET /user/:userId/seats

- User gives businessId, date, time, movieId in request body and gets the available seats for the movie selected as response

## Business APIs

### POST /user/:userId/business

- User can register their business by providing details about business. Example:

  ```
  {
    "businessName": "INOX CC1",
    "GST": "06BZAHM6385P6Z1",
    "address": {
        "state": "West Bengal",
        "city": "Kolkata",
        "pincode": 700156
    },
    "shows": {
        "25/10/2022": [
            {
                "movieId": "6357bdce16c757135d2dc4c9",
                "timings": "1:10 PM",
                "screen": 3,
                "availableSeats": {
                    "A": 17,
                    "B": 25,
                    "C": 25,
                    "D": 25,
                    "E": 25,
                    "F": 25,
                    "G": 20
                },
                "ticketPrice": {
                    "A": 200,
                    "B": 50,
                    "C": 100,
                    "D": 125,
                    "E": 125,
                    "F": 215,
                    "G": 180
                }
            },
            {
                "movieId": "6357bdce16c757135d2dc4c9",
                "timings": "4:30 PM",
                "screen": 2,
                "availableSeats": {
                    "A": 15,
                    "B": 10
                }
            }
        ],
        "26/10/2022": [
            {
                "movieId": "6357bdce16c757135d2dc4c9",
                "timings": "1:10 PM",
                "screen": 3,
                "availableSeats": {
                    "A": 17,
                    "B": 25,
                    "C": 25
                },
                "ticketPrice": {
                    "A": 200,
                    "B": 50,
                    "C": 150
                }
            }
        ]
    }
  }

  ```

- Response Structure:

  ```
  {
    "status": true,
    "data": {
        "userId": "63561533ae0a34e4aef3e054",
        "businessName": "INOX CC1",
        "GST": "06BZAHM6385P6Z1",
        "address": {
            "state": "West Bengal",
            "city": "Kolkata",
            "pincode": 700156
        },
        "shows": {
            "25/10/2022": [
                {
                    "movieId": "6357bdce16c757135d2dc4c9",
                    "timings": "1:10 PM",
                    "screen": 3,
                    "availableSeats": {
                        "A1": "Available",
                        "A2": "Available",
                        "A3": "Available",
                        "A4": "Available",
                        "A5": "Available",
                        "A6": "Available",
                        "A7": "Available",
                        "A8": "Available",
                        "A9": "Available",
                        "A10": "Available",
                        "A11": "Available",
                        "A12": "Available",
                        "A13": "Available",
                        "A14": "Available",
                        "A15": "Available",
                        "A16": "Available",
                        "A17": "Available",
                        "B1": "Available",
                        "B2": "Available",
                        "B3": "Available",
                        "B4": "Available",
                        "B5": "Available",
                        "B6": "Available",
                        "B7": "Available",
                        "B8": "Available",
                        "B9": "Available",
                        "B10": "Available",
                        "B11": "Available",
                        "B12": "Available",
                        "B13": "Available",
                        "B14": "Available",
                        "B15": "Available",
                        "B16": "Available",
                        "B17": "Available",
                        "B18": "Available",
                        "B19": "Available",
                        "B20": "Available",
                        "B21": "Available",
                        "B22": "Available",
                        "B23": "Available",
                        "B24": "Available",
                        "B25": "Available",
                        "C1": "Available",
                        "C2": "Available",
                        "C3": "Available",
                        "C4": "Available",
                        "C5": "Available",
                        "C6": "Available",
                        "C7": "Available",
                        "C8": "Available",
                        "C9": "Available",
                        "C10": "Available",
                        "C11": "Available",
                        "C12": "Available",
                        "C13": "Available",
                        "C14": "Available",
                        "C15": "Available",
                        "C16": "Available",
                        "C17": "Available",
                        "C18": "Available",
                        "C19": "Available",
                        "C20": "Available",
                        "C21": "Available",
                        "C22": "Available",
                        "C23": "Available",
                        "C24": "Available",
                        "C25": "Available",
                        "D1": "Available",
                        "D2": "Available",
                        "D3": "Available",
                        "D4": "Available",
                        "D5": "Available",
                        "D6": "Available",
                        "D7": "Available",
                        "D8": "Available",
                        "D9": "Available",
                        "D10": "Available",
                        "D11": "Available",
                        "D12": "Available",
                        "D13": "Available",
                        "D14": "Available",
                        "D15": "Available",
                        "D16": "Available",
                        "D17": "Available",
                        "D18": "Available",
                        "D19": "Available",
                        "D20": "Available",
                        "D21": "Available",
                        "D22": "Available",
                        "D23": "Available",
                        "D24": "Available",
                        "D25": "Available"
                    },
                    "ticketPrice": {
                        "A": 200,
                        "B": 50,
                        "C": 100,
                        "D": 125
                    }
                },
                {
                    "movieId": "6357bdce16c757135d2dc4c9",
                    "timings": "4:30 PM",
                    "screen": 2,
                    "availableSeats": {
                        "A1": "Available",
                        "A2": "Available",
                        "A3": "Available",
                        "A4": "Available",
                        "A5": "Available",
                        "A6": "Available",
                        "A7": "Available",
                        "A8": "Available",
                        "A9": "Available",
                        "A10": "Available",
                        "A11": "Available",
                        "A12": "Available",
                        "A13": "Available",
                        "A14": "Available",
                        "A15": "Available",
                        "B1": "Available",
                        "B2": "Available",
                        "B3": "Available",
                        "B4": "Available",
                        "B5": "Available",
                        "B6": "Available",
                        "B7": "Available",
                        "B8": "Available",
                        "B9": "Available",
                        "B10": "Available"
                    },
                    "ticketPrice": {
                        "A": 200,
                        "B": 50
                    }
                }
            ],
            "26/10/2022": [
                {
                    "movieId": "6357bdce16c757135d2dc4c9",
                    "timings": "1:10 PM",
                    "screen": 3,
                    "availableSeats": {
                        "A1": "Available",
                        "A2": "Available",
                        "A3": "Available",
                        "A4": "Available",
                        "A5": "Available",
                        "A6": "Available",
                        "A7": "Available",
                        "A8": "Available",
                        "A9": "Available",
                        "A10": "Available",
                        "A11": "Available",
                        "A12": "Available",
                        "A13": "Available",
                        "A14": "Available",
                        "A15": "Available",
                        "A16": "Available",
                        "A17": "Available",
                        "B1": "Available",
                        "B2": "Available",
                        "B3": "Available",
                        "B4": "Available",
                        "B5": "Available",
                        "B6": "Available",
                        "B7": "Available",
                        "B8": "Available",
                        "B9": "Available",
                        "B10": "Available",
                        "B11": "Available",
                        "B12": "Available",
                        "B13": "Available",
                        "B14": "Available",
                        "B15": "Available",
                        "B16": "Available",
                        "B17": "Available",
                        "B18": "Available",
                        "B19": "Available",
                        "B20": "Available",
                        "B21": "Available",
                        "B22": "Available",
                        "B23": "Available",
                        "B24": "Available",
                        "B25": "Available",
                        "C1": "Available",
                        "C2": "Available",
                        "C3": "Available",
                        "C4": "Available",
                        "C5": "Available",
                        "C6": "Available",
                        "C7": "Available",
                        "C8": "Available",
                        "C9": "Available",
                        "C10": "Available",
                        "C11": "Available",
                        "C12": "Available",
                        "C13": "Available",
                        "C14": "Available",
                        "C15": "Available",
                        "C16": "Available",
                        "C17": "Available",
                        "C18": "Available",
                        "C19": "Available",
                        "C20": "Available",
                        "C21": "Available",
                        "C22": "Available",
                        "C23": "Available",
                        "C24": "Available",
                        "C25": "Available"
                    },
                    "ticketPrice": {
                        "A": 200,
                        "B": 50,
                        "C": 150
                    }
                }
            ]
        },
        "isDeleted": false,
        "deletedAt": null,
        "_id": "635911bbdf563651f5b24b86",
        "createdAt": "2022-10-26T10:53:47.269Z",
        "updatedAt": "2022-10-26T10:53:47.269Z",
        "__v": 0
    }


  ```

### GET /user/:userId/business/:businessId

- Fetches business with userId and businessId

### PUT /user/:userId/business/:businessId

- Updates business details except shows

### PUT /user/:userId/business/:businessId/shows

- Updates shows by the request body's details
- Can have insert:1 or remove:1 to insert a show to a specific date or remove a show
- Request body:
  ```
  {
    "date": "25/10/2022",
    "showDetails": [
        {
            "movieId": "635610a2bf6bdb8143afa91e",
            "timings": "1:10 PM",
            "screen": 3,
            "availableSeats": {
                "A": 17,
                "B": 25,
                "C": 25,
                "D": 25,
                "E": 25
            },
            "ticketPrice": {
                "A": 200,
                "B": 50,
                "C": 100,
                "D": 125,
                "E": 125
            }
        }
    ],
    "insert": 1
  }
  ```

### DELETE /user/:userId/business/:businessId

- Deletes business with the given businessId

## Cart APIs

### POST /user/:userId/cart

- Creates cart with the given request:

```
{
    "businessId": "6358b854566342aa8aab8054",
    "date": "25/10/2022",
    "time": "1:10 PM",
    "movieId": "6357bdce16c757135d2dc4c9",
    "seats": [
        "A1",
        "A2",
        "C3"
    ]
}
```

- The user have to complete their order within 5 mins or the cart gets deleted with the mongodb TTL indexing.
- While the seats are in the cart no one else can book those seats

### GET /user/:userId/cart

- Fetches the cart with the cartId in the request body.

### DELETE /user/:userId/cart

- Permanently deletes the cart document with the cartId from the request body

## Order APIs

### POST /user/:userId/order

- Creates cart with the the userId, businessId and cartId

### GET /user/:userId/order

- Gets the order created

### DELETE /user/:userId/order

- Can cancel an order
