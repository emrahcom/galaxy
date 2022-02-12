<script lang="ts">
  import { get } from "svelte/store";
  import { identity as id } from "$lib/stores/kratos";

  const identity = get(id);
</script>

<!-- -------------------------------------------------------------------------->
<h2>Dashboard</h2>
<p>Hello {identity.traits.email}</p>
