/**
 * An array of routes that are accessible to public
 * These routes do not require authentication
 * @types { string[] }
 */

export const publicRoutes = [
    "/",
    "/auth/new-verification",
    
   
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to `/settings`
 * @types { string[] }
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix will be used for API's
 * @types { string }
 */

export const apiAuthPrefix = "/api/auth"

/**
 * The defualt redirect path after loggin in
 * @type { string }
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings"