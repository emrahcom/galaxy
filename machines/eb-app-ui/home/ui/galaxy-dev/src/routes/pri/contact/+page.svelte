<script lang="ts">
  import { list } from "$lib/api";
  import { contactStatusHandler } from "$lib/pri/contact";
  import List from "$lib/components/pri/contact/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/contact/list", 1000);

  contactStatusHandler();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My contacts"
  hrefKey="/pri/contact/invite"
  hrefKeyTitle="Show keys (friendship links)"
/>

{#await pr then contacts}
  <List {contacts} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
