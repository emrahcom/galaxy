#### clean up

```bash
cd /home/ui/galaxy-dev

rm package-lock.json
rm yarn.json
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
(cd /home/ui/galaxy-dev && yarn run dev --host --port 3000)
```

#### Added modules

```bash
yarn add --dev @sveltejs/adapter-static
yarn add --dev @types/bootstrap
yarn add --dev @types/qrcode
yarn add --dev qrcode
yarn add @popperjs/core
yarn add bootstrap
yarn add bootstrap-icons
```
