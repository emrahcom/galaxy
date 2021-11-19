## API notes

### response check

- check the response status. It should be `http/200`. If not, this means that
  something went wrong.

- check if the response is empty or not. If empty, this means that there is no
  error but nothing changed on the server side too. For example, trying to
  update some records but nothing matches to the criteria. No needs to check
  further steps if the response is empty.

- check if the response is a valid json.

- chech if there is an error field in json.

- check if the needed value is exist in json.
