<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import SetGuest from "$lib/components/pri/meeting-member/set-guest.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/member/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Set this member as guest" />

{#await pr then member}
  <SetGuest p={member} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
