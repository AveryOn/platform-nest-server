# AuthModule

## Purpose:

> Implements the core user authentication flow. Manages the login process, issuing access and refresh tokens, credential verification, and initiating additional authentication stages

## Responsibilities:

- handling the login flow
- verifying user credentials
- issuing an access token
- creating a device session
- issuing a refresh token
- initiating 2FA when required
- initiating step-up when required
- normalization and protection of the login pipeline (timing attack mitigation)

## Does not handle:

- user storage
- OAuth identity management
- refresh token management
- device session management
- storage of 2FA settings
- risk analysis

These responsibilities are delegated to the corresponding modules

## Main dependencies:

- UsersModule
- SessionsModule
- RefreshTokensModule
- TwoFactorModule
- StepUpModule
- DeviceModule
- RiskModule

## Boundaries:

- AuthModule coordinates authentication but does not store long-lived state. All persistent data (users, sessions, refresh tokens, oauth identities) belong to specialized modules.

## Result of execution:

- created or updated device session
- access token
- refresh token
- or a requirement for an additional authentication step (2FA / step-up).
