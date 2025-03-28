# API Documentation for User Authentication System

## Base URL

`/api/v1/user`

---

## **1. Register User**

### **POST /create-user**

This endpoint is used to register a new user.

### Request Headers:

- `Content-Type: application/json`

### Request Body:

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": 1234567890,
  "password": "password123"
}
```

### Responses:

#### **Success (201):**

```json
{
  "message": "User created",
  "user": {
    "id": "63e46f8e764abc123456789",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": 1234567890,
    "role": "User",
    "totalWalletAmount": 0,
    "noOfCouponRedeem": 0
  }
}
```

#### **Error (400):**

1. Missing required fields:

```json
{
  "message": "No required information available",
  "success": false
}
```

2. User already exists:

```json
{
  "message": "User already exists try logging into your account",
  "success": false
}
```

3. Failed to send email:

```json
{
  "message": "Failed to send gmail",
  "success": false
}
```

---

## **2. Verify User**

### **POST /verify-user**

This endpoint verifies a user's account using the OTP sent to their email.

### Request Headers:

- `Content-Type: application/json`

### Request Body:

```json
{
  "email": "johndoe@example.com",
  "otp": "123456"
}
```

### Responses:

#### **Success (200):**

```json
{
  "success": true,
  "message": "Account successfully verified."
}
```

#### **Error (400):**

1. Missing required fields:

```json
{
  "message": "Email and OTP are required",
  "success": false
}
```

2. User not found:

```json
{
  "message": "User not found",
  "success": false
}
```

3. OTP expired:

```json
{
  "message": "OTP has expired",
  "success": false
}
```

4. Invalid OTP:

```json
{
  "message": "Invalid OTP",
  "success": false
}
```

---

## **3. Login User**

### **POST /login-user**

This endpoint is used to authenticate an existing user and provide an access token.

### Request Headers:

- `Content-Type: application/json`

### Request Body:

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

### Responses:

#### **Success (200):**

```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "63e46f8e764abc123456789",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "role": "User",
    "totalWalletAmount": 0,
    "noOfCouponRedeem": 0
  }
}
```

#### **Error (400):**

1. Missing email or password:

```json
{
  "success": false,
  "message": "Email and password are required."
}
```

2. User not found:

```json
{
  "success": false,
  "message": "User does not exist. Please register first."
}
```

3. Unverified email:

```json
{
  "success": false,
  "message": "Email is not verified. Please verify your account."
}
```

4. Invalid password:

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

5. Server error:

```json
{
  "success": false,
  "message": "An error occurred during login. Please try again."
}
```

# Get User Profile Detail API

## Overview

The `getUserProfileDetail` function is a controller that retrieves the profile details of a logged-in user based on their user ID. It ensures authentication and returns the necessary user information while excluding sensitive fields.

## Endpoint

**Method:** GET  
**URL:** `/api/user/profile`

## Request Headers

- **Authorization:** Bearer `<JWT_TOKEN>` (Required)

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Getting user details successfully",
  "user": {
    "_id": "1234567890abcdef",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Error Responses

- **401 Unauthorized**

```json
{
  "success": false,
  "message": "No user id found"
}
```

- **500 Internal Server Error**

```json
{
  "success": false,
  "message": "Error getting user profile detail"
}
```

#### Error Responses

- **401 Unauthorized**

```json
{
  "success": false,
  "message": "No user id found"
}
```

- **500 Internal Server Error**

## Handle Forget Password API

### Overview

The `handleForgetPassword` function is a controller that manages the password reset process. It generates a one-time password (OTP), sends it via email, and updates the user's password in the database.

### Endpoint

**Method:** POST\
**URL:** `/api/user/forget-password`

### Request Headers

- **Authorization:** Bearer `<JWT_TOKEN>` (Required)

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "OTP sent successfully to the registered email."
}
```

#### Error Responses

- **400 Bad Request** (If user is not found)

```json
{
  "success": false,
  "message": "No user found in db"
}
```

- **400 Bad Request** (If email sending fails)

```json
{
  "success": false,
  "message": "Failed to send gmail"
}
```

- **500 Internal Server Error**

```json
{
  "success": false,
  "message": "Error in handler forget password"
}
```

### Notes

- The system generates a 6-digit OTP for password reset.
- The OTP is temporarily stored as the new password until the user sets a permanent one.
- The function relies on `sendMail` utility for email delivery.

# Coupon System API Documentation

## Routes Overview

This API provides two main routes for managing coupons:

1. `/api/v1/coupon/create-coupon` - Allows the admin to create coupons.
2. `/api/v1/coupon/redeem-coupon` - Allows users to redeem a coupon and update their wallet balance.

---

## Route: `/api/v1/coupon/create-coupon`

### Method: `POST`

### Description:

This route is used by the admin to create one or more coupons with a specified amount.

### Request Body:

- `amount` (Number, Required): The monetary value associated with each coupon.
- `couponNo` (Number, Required): The number of coupons to create. A maximum of 50 coupons can be created at once.

### Validation:

1. `amount` and `couponNo` are required.
2. `couponNo` must be greater than 0.
3. Maximum limit for `couponNo` is 50.

### Response:

#### Success:

- **Status Code:** `201`
- **Response Body:**

```json
{
    "message": "<couponNo> coupons created successfully",
    "coupons": [
        {
            "couponCode": "<unique_coupon_code>",
            "couponAmount": <amount>
        },
        ...
    ]
}
```

#### Errors:

- **Status Code:** `400`
  - Missing or invalid `amount` or `couponNo`.
  - "Maximum 50 coupons can be created at once."

### Controller: `handleCreateCoupon`

#### Description:

This controller generates unique coupon codes, validates the input, and saves the coupons to the database.

#### Steps:

1. Validate input (`amount`, `couponNo`).
2. Ensure `couponNo` does not exceed 50.
3. Generate unique coupon codes using `uniqid()`.
4. Check database for duplicate coupon codes to ensure uniqueness.
5. Save all coupons to the database using `insertMany`.
6. Return a success response.

#### Example Request Body:

```json
{
  "amount": 100,
  "couponNo": 5
}
```

#### Example Success Response:

```json
{
  "message": "5 coupons created successfully",
  "coupons": [
    { "couponCode": "abc123", "couponAmount": 100 },
    { "couponCode": "def456", "couponAmount": 100 },
    { "couponCode": "ghi789", "couponAmount": 100 },
    { "couponCode": "jkl012", "couponAmount": 100 },
    { "couponCode": "mno345", "couponAmount": 100 }
  ]
}
```

---

## Route: `/api/v1/coupon/redeem-coupon`

### Method: `POST`

### Description:

Allows users to redeem a coupon by providing a valid coupon code. The coupon's amount is added to the user's wallet, and the coupon is marked as used.

### Request Body:

- `couponCode` (String, Required): The unique code of the coupon to redeem.

### Validation:

1. `couponCode` is required.
2. The coupon must exist in the database.
3. The coupon must not be already used.
4. The user must be authenticated.

### Response:

#### Success:

- **Status Code:** `200`
- **Response Body:**

```json
{
    "message": "Coupon redeemed successfully",
    "walletAmount": <updated_wallet_balance>,
    "redeemedCoupons": <total_coupons_redeemed_by_user>
}
```

#### Errors:

- **Status Code:** `400`
  - "Coupon code required."
  - "Invalid coupon code."
  - "Coupon already used. Try purchasing a new product."
- **Status Code:** `401`
  - "Unauthorized: User not logged in."

### Controller: `handleRedeemCoupon`

#### Description:

This controller processes coupon redemption by verifying the coupon and user details, then updating the database atomically.

#### Example Request Body:

```json
{
  "couponCode": "abc123"
}
```

#### Example Success Response:

```json
{
  "message": "Coupon redeemed successfully",
  "walletAmount": 500,
  "redeemedCoupons": 3
}
```

---

## Error Handling:

All errors are handled using a custom `ApiError` class that sends appropriate status codes and messages. Errors are passed to the next middleware using `next(error)`.

### 1. Get All Redeemed Coupons

**Endpoint:** `/api/coupons/redeemd-coupons-list`  
**Method:** `GET`  
**Description:** Retrieves a list of all redeemed coupons along with the user details (only `name` and `_id`).  
**Response:**

- `200 OK`: Returns the list of redeemed coupons.
- `500 Internal Server Error`: If an error occurs while fetching data.

### 2. Get Redeemed Coupons by User

**Endpoint:** `/api/coupons/redeemd-coupons-list-user`  
**Method:** `GET`  
**Description:** Retrieves a list of redeemed coupons for the authenticated user.  
**Authentication:** Required (User must be logged in).  
**Response:**

- `200 OK`: Returns the list of redeemed coupons for the user.
- `500 Internal Server Error`: If an error occurs while fetching data.

## Response Format

```json
{
  "success": true,
  "message": "coupons retrieved successfully",
  "coupons": [
    {
      "_id": "couponId",
      "code": "COUPON123",
      "discount": 10,
      "usedByUser": "userId"
    }
  ]
}
```
