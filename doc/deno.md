install
=======
```bash
curl -sSf https://github.com/denoland/deno/releases | \
    grep -o "/denoland/deno/releases/download/.*/deno-.*linux.*\.zip"

LATEST=$(curl -sSf https://github.com/denoland/deno/releases | \
         grep -o "/denoland/deno/releases/download/.*/deno-.*linux.*\.zip" | \
         head -n1)

cd /tmp
wget -O deno.zip https://github.com/$LATEST
unzip deno.zip
./deno --version

cp /tmp/deno /usr/local/bin/
deno --version
```

help
====
```bash
deno help
deno help run
```

run
===
`--watch` is not working correctly.

```bash
deno run --allow-net api.ts
deno run --watch --unstable --allow-net api.ts
```

format check
============
```bash
deno fmt --check
deno fmt --check api.ts
```
