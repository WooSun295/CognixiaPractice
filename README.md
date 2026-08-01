# REST API using FastAPI and Connected to MongoDB Cloud Atlas

## Versions

- v1: API with Hardcoded Data
- v2: API connected to Mongo DB Cloud Atlas
- v3: Trimmed down the requests into only needed ones. Nothing actually gets deleted, only deactivated/closed, but admin can turn them back on. Also added cascade deactivation if user gets deactivated, but no cascading on reactivation.
- v4: Adding authentication with JWT
- v5: Changing all routes that had /{userId} to be only accessible by admin and for customers, its /me. The backend uses to userId from the token to get the user's information. Also, to do this, has to create a new router for /admin for duplicate route functions like /users/{userId} and /users/me as they are both processed the same way so whichever comes first is the one that loads.
