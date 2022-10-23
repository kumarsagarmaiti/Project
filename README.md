# Movies-Management

## Project-Management of movie booking

### Key points

- This project is divided into 5 features namely Business,User, Movie, Cart and Order.

## FEATURE I - Business

### MODEL

-Business Model

```yaml
{
  fname: { type: String, required: true, trim: true },
  lname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true, unique: true },
  GST: { type: String, required: true, trim: true, unique: true },
  businessName: { type: String, required: true, trim: true, unique: true },
  address:
    {
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: Number, required: true, trim: true },
    },
  shows:
    [
      {
        movieId: { type: ObjectId, ref: "Movies", required: true },
        timings: [{ type: String, required: true }],
        dates: [{ type: Date, required: true }],
        availableSeats: [{ type: String, required: true }],
        ticketPrice: [{ type: String, required: true }],
        _id: false,
      },
    ],
  isDeleted: { type: Boolean, default: null },
  deletedAt: { type: Date, default: null },
}
```

## Business APIs

### POST /register/business

-Create a business document from request body.
-Save password in an encrypted format

- **Response format**
  - _**On success**_ - Return HTTP status 201. Also return the user document. The response should be a JSON object like [this](#successful-response-structure)
  - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

```yaml
{ //give the business document successful response }
```

### POST /login/business

- Allow an user to login with their email and password.
- On a successful login attempt return the userId and a JWT token contatining the userId, exp, iat.
- _**On success**_ - Return HTTP status 200 and JWT token in response body. The response should be a JSON object like [this](#successful-response-structure)
  - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

```yaml
{
  "status": true,
  "message": "User login successfull",
  "data":
    {
      "userId": "6165f29cfe83625cf2c10a5c",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyODc2YWJkY2I3MGFmZWVhZjljZjUiLCJpYXQiOjE2MzM4NDczNzYsImV4cCI6MTYzMzg4MzM3Nn0.PgcBPLLg4J01Hyin-zR6BCk7JHBY-RpuWMG_oIK7aV8",
    },
}
```

## GET /business/:businessId/profile (Authentication and Authorisation required)

- Allow an user to fetch details of their business profile.
- Make sure that businessId in url param and in token is same
- **Response format**
  - _**On success**_ - Return HTTP status 200 and returns the user document. The response should be a JSON object like [this](#successful-response-structure)
  - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

```yaml
{}
```

## PUT /business/:businessId/profile (Authentication and Authorisation required)

- Allow an user to update their business profile.
- An user can update all the fields
- Make sure that businessId in url param and in token is same
- **Response format**
  - _**On success**_ - Return HTTP status 200. Also return the updated user document. The response should be a JSON object like [this](#successful-response-structure)
  - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

```yaml
{}
```
