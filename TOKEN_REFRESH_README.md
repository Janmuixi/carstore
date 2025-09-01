# Token Refresh Implementation

This implementation adds automatic token refresh functionality to the carstore application.

## Overview

The system now uses two types of tokens:
- **Access Token**: Short-lived (1 hour by default) for API requests
- **Refresh Token**: Long-lived (7 days by default) for getting new access tokens

## Backend Changes

### Auth Middleware (`api/src/middlewares/auth.js`)
- Added `generateRefreshToken()` function
- Added `verifyRefreshToken()` function  
- Added `generateTokenPair()` function to create both tokens at once

### Users Controller (`api/src/controllers/users.js`)
- Updated login endpoint to return both access and refresh tokens
- Added new `/users/refresh` endpoint for token refresh
- Updated response structure to include user data and both tokens

### Environment Variables
Added to `docker-compose.yaml`:
- `JWT_REFRESH_SECRET`: Secret for signing refresh tokens
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time (7d)

## Frontend Changes

### Auth Store (`platform/stores/auth.js`)
- Updated state to store both `accessToken` and `refreshToken`
- Added `isRefreshing` flag to prevent multiple simultaneous refresh attempts
- Added `refreshTokens()` method for manual token refresh
- Updated login/logout methods to handle new token structure
- Added getters for `token` (returns accessToken) and `isAuthenticated`

### API Fetch Composable (`platform/composables/useApiFetch.js`)
- Added automatic token refresh on 401/403 errors
- Retries failed requests with new tokens
- Redirects to login if refresh fails

### Login Page (`platform/pages/admin/login.vue`)
- Updated to use new auth store login method
- Added loading state during login
- Improved error handling

## How It Works

1. **Login**: User logs in and receives both access and refresh tokens
2. **API Calls**: All API calls use the access token
3. **Token Expiry**: When access token expires (401/403 error):
   - System automatically attempts to refresh using refresh token
   - If successful, retries the original request with new access token
   - If refresh fails, user is logged out and redirected to login
4. **Manual Refresh**: Can also manually refresh tokens using `authStore.refreshTokens()`

## Usage Examples

### Manual Token Refresh
```javascript
const authStore = useAuthStore()
try {
  await authStore.refreshTokens()
  // Tokens are now updated
} catch (error) {
  // Refresh failed, user needs to login again
}
```

### Check Authentication Status
```javascript
const authStore = useAuthStore()
if (authStore.isAuthenticated) {
  // User is logged in
}
```

### Get Current Token
```javascript
const authStore = useAuthStore()
const token = authStore.token // Returns accessToken
```

## Security Features

- Refresh tokens are separate from access tokens
- Refresh tokens have longer expiration but are still time-limited
- Failed refresh attempts immediately log out the user
- Multiple simultaneous refresh attempts are prevented
- All tokens are cleared on logout

## Testing

To test the token refresh:
1. Login to the application
2. Wait for the access token to expire (1 hour by default)
3. Make an API request - it should automatically refresh and retry
4. Or manually call `authStore.refreshTokens()`

The system will automatically handle token refresh in the background without user intervention.
