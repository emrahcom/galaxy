<script lang="ts">
  import { getContext } from "svelte";
  import { APP } from "$lib/config";
  import type { KratosIdentity } from "$lib/kratos-types";

  const identity: KratosIdentity = getContext("identity");
</script>

<!-- -------------------------------------------------------------------------->
<h2>Dashboard</h2>
<p>Hello {identity.traits.name.first}</p>
<a href="{APP}/settings">Settings</a>
<a href="{APP}/auth/logout">Logout</a>
