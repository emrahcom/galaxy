<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Show keys";

  const icon = "bi-key";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
