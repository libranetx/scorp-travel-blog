# Authentication and Access Control Setup

## Overview
This document outlines the authentication and authorization setup for the blog application, ensuring that only read operations are publicly accessible while create, update, and delete operations require admin privileges.

## Access Control Matrix

| Operation | Public Access | Admin Only | Route |
|-----------|---------------|------------|-------|
| **READ** | ✅ Yes | ✅ Yes | `GET /api/posts`, `GET /api/posts/[id]` |
| **CREATE** | ❌ No | ✅ Yes | `POST /api/posts` |
| **UPDATE** | ❌ No | ✅ Yes | `PUT /api/posts/[id]` |
| **DELETE** | ❌ No | ✅ Yes | `DELETE /api/posts/[id]` |
| **UPLOAD** | ❌ No | ✅ Yes | `POST /api/upload` |

## Implementation Details

### 1. Authentication Helper (`lib/auth.ts`)
- `getCurrentUser()`: Gets the current authenticated user
- `requireAuth()`: Ensures user is authenticated (returns 401 if not)
- `requireAdmin()`: Ensures user is authenticated and has ADMIN role (returns 403 if not admin)

### 2. API Route Protection
All protected API routes now include authentication checks:

```typescript
// Example from POST /api/posts
const authResult = await requireAdmin();
if (authResult instanceof NextResponse) {
  return authResult; // Returns 401 or 403 error
}
```

### 3. Middleware Protection (`middleware.ts`)
- Protects `/dashboard/*` routes - requires authentication
- Protects `/dashboard/postsAdmin/*` routes - requires ADMIN role
- Protects `/posts/new` and `/posts/edit` routes - requires ADMIN role
- Redirects unauthenticated users to `/auth/signin`
- Redirects non-admin users to appropriate pages

### 4. Frontend Error Handling
The `PostView` component now handles authentication errors gracefully:
- 401 errors: "Please sign in to [action] posts"
- 403 errors: "Admin access required to [action] posts"
- Shows appropriate error messages to users

### 5. User Roles
- Default user role: `ADMIN` (as defined in Prisma schema)
- Role is stored in the JWT token and session
- Role checking happens on both client and server side

## Security Features

### ✅ Implemented
- JWT-based authentication with NextAuth.js
- Role-based access control (RBAC)
- Server-side authentication validation
- Client-side route protection
- Proper error handling and user feedback
- Secure session management

### 🔒 Protected Routes
- `/dashboard/*` - Requires authentication
- `/dashboard/postsAdmin/*` - Requires ADMIN role
- `/posts/new` - Requires ADMIN role
- `/posts/edit` - Requires ADMIN role

### 🌐 Public Routes
- `/` - Homepage (read-only)
- `/posts` - Posts listing (read-only)
- `/posts/[id]` - Individual post view (read-only)
- `/auth/signin` - Login page
- `/auth/signup` - Registration page

## Testing the Setup

### 1. Public Access (No Authentication Required)
```bash
# These should work without authentication
GET /api/posts
GET /api/posts/1
```

### 2. Admin Access Required
```bash
# These should return 401/403 without admin authentication
POST /api/posts
PUT /api/posts/1
DELETE /api/posts/1
POST /api/upload
```

### 3. Route Protection
- Try accessing `/dashboard/postsAdmin` without authentication → redirects to `/auth/signin`
- Try accessing `/posts/new` without admin role → redirects to `/posts`

## User Management

### Creating Admin Users
1. Register a new user via `/auth/signup`
2. The user will automatically have `ADMIN` role (default in schema)
3. Sign in with the credentials

### Changing User Roles
To change user roles, you would need to:
1. Access the database directly
2. Update the `role` field in the `users` table
3. Valid roles: `ADMIN`, `USER` (though currently only ADMIN is used)

## Error Messages

### Authentication Errors
- **401 Unauthorized**: "Authentication required" / "Please sign in to [action] posts"
- **403 Forbidden**: "Admin access required" / "Admin access required to [action] posts"

### User Experience
- Clear error messages guide users to sign in
- Automatic redirects to appropriate pages
- Visual indicators for admin status

## Future Enhancements

1. **User Management Interface**: Add admin panel to manage user roles
2. **Multiple Roles**: Implement different permission levels (Editor, Moderator, etc.)
3. **Audit Logging**: Track who performed what actions
4. **Rate Limiting**: Prevent abuse of API endpoints
5. **Two-Factor Authentication**: Enhanced security for admin accounts 