#### clean up

```bash
cd /home/ui/galaxy-dev

rm package-lock.json
rm -rf node_modules
rm -rf .svelte-kit

npm install
```

#### check

```bash
npm run check
npm run lint
deno fmt --check src
```

#### run

```bash
(cd /home/ui/galaxy-dev && npm run dev)
```

or

```bash
(cd /home/ui/galaxy-dev && npm run dev -- --host 127.0.0.1 --port 3000)
```
