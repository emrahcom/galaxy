#### clean up

```bash
cd /home/ui/galaxy-dev

rm package-lock.json
rm -rf node_modules
rm -rf .svelte-kit
```

#### running

```bash
(cd /home/ui/galaxy-dev && npm run dev -- --host --port 3000)
```

#### check

```bash
npm run check
npm run lint
deno fmt --check src
```
