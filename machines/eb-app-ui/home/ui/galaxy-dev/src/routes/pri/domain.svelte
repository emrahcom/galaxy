<script lang="ts">
  import { listDomain } from "$lib/pri/domain";

  const promise = listDomain();
</script>

<!-- -------------------------------------------------------------------------->
{#await promise}
  waiting...
{:then domains}
  {domains}
{:catch}
  something went wrong
{/await}
