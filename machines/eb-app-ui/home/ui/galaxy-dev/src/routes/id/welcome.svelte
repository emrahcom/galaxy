<script lang="ts" context="module">
  import { browser } from "$app/env";

  export async function load() {
    if (!browser) return {};

    return {
      status: 302,
      redirect: "/pri",
    };
  }
</script>
