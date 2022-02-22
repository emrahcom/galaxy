<script lang="ts">
  import { listDomain } from "$lib/pri/domain";

  const domains = await listDomain();
</script>

<!-- -------------------------------------------------------------------------->
{domains}
