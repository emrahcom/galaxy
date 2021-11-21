## research

- ory kratos
- database modules
- database codes

## design

- database
- database, room scheduler, publishing time
  - always on
  - periodic
  - oneshot, unregular
- calling system
- spam filter for the calling system
- groups (domain or room groups according to subject)
- subcription to the groups
- categories and tags
- meeting reservation and invite system

## guest

- a guest can only create meetings on public domains.
- an ephemeral meeting has always a random room name without a suffix. use
  `uuid` inside the name to avoid the unique key constraint.
