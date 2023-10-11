#### running

```bash
(cd /home/api/galaxy && deno run --allow-net --allow-env --watch index-adm.ts)
(cd /home/api/galaxy && deno run --allow-net --allow-env --watch index-pri.ts)
(cd /home/api/galaxy && deno run --allow-net --allow-env --watch index-pub.ts)
```

#### checking

```bash
cd /home/api/galaxy

deno fmt --check
deno lint
deno check $(find -name '*.ts')
```
