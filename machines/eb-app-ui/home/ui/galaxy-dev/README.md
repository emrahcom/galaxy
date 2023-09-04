#### clean up

```bash
cd /home/ui/galaxy-dev

rm package-lock.json
rm -rf node_modules
rm -rf .svelte-kit

yarn install
```

#### check

```bash
yarn run check
yarn run lint
deno fmt --check src
```

#### run

`internal IP` is required for websockets during development.

```bash
(cd /home/ui/galaxy-dev && npm run dev -- --host --port 3000)
```
