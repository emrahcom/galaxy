# install

```bash
curl -sSf https://github.com/denoland/deno/releases | \
    grep -o "/denoland/deno/releases/download/.*/deno-.*linux.*\.zip"

LATEST=$(curl -sSf https://github.com/denoland/deno/releases | \
    grep -o "/denoland/deno/releases/download/.*/deno-.*linux.*\.zip" | \
    head -n1)
echo $LATEST

cd /tmp
wget -O deno.zip https://github.com/$LATEST
unzip deno.zip
./deno --version

cp /tmp/deno /usr/local/bin/
deno --version
```

# help

```bash
deno help
deno help run
```

# run

`--watch` is not working correctly.

```bash
deno run --allow-net index.ts
deno run --watch --unstable --allow-net index.ts
```

# format check

```bash
deno fmt --check
deno fmt --check index.ts
```

# lint

```bash
deno lint --unstable
deno lint --unstable index.ts
```

# cache

```bash
rm -rf .cache/deno
```
