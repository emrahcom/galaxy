## research

## design

- categories and tags for (public) meetings
- P2P meeting with guest queue (like helpdesk)
- Allow guest to call a member directly if she has a key (QR code)
- Hold button for direct call?
- Meeting visible for public and visible for autheticated users

## features

- Jitsi querystring configs for session, member etc
- a guest can only create meetings on public domains

## bugs

- Is the checking of enabled of identity needed?\
  How to disable the user? In identity provider..?
- is id needed in public types such as Meeting000? Check again in the context of
  security

## database

- index optimizations
- delete expired or keep as inactive?

## test

- add tests for accept/reject/drop request
- add tests for contact
- add tests for invite contact to domain partnership
- add tests for invite contact to room partnership
- add tests for invite contact to meeting membership
- add tests for invite contact to friendship
- add tests for direct call
- add tests for phone
