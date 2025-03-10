## Research

## Design

- Categories and tags for (public) meetings
- Direct call with guest queue (like helpdesk)
- Hold button for direct call?
- Public meeting that is visible for all or only for autheticated users.

## Features

- Jitsi querystring configs for session, member etc.
- A guest can only create meetings on public domains.
- Public domains with authentication (maybe with JWT)
- Info text for contact?
- Instant text messages through extension
- Direct call to a group (ring every members at the same time and put them on
  the same meeting

## Bugs

- Is the checking of enabled of identity needed?\
  How to disable the user? In identity provider..?

## Database

- Index optimizations
- Delete expired or keep as inactive?\
  From a technical point of view, periodic deleting at short intervals is more
  effective.\
  From a non-technical perspective, it makes more sense to keep a history.

## Testing

- Add tests for direct call
- Add tests for phone
- Add tests for extension related endpoints
