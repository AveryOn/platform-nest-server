# UserModule

## Purpose

Manages the user model and access to user data.

## Responsibilities

- creating users
- reading users
- updating user data
- deleting or deactivating users
- storing core user attributes
- searching users by identifiers (id, email, etc.)

## Does not handle

- authentication
- session management
- refresh tokens
- OAuth identity
- 2FA
- step-up
- risk analysis

## Main dependencies

Has no mandatory dependencies inside the auth domain.

## Boundaries

UserModule owns the `user` table and all operations on it. (As well as `user_role`)
Other modules may only request user data or reference `user_id`.

## Result of execution

- creation or modification of a user record
- providing user data to other modules.
