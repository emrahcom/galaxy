<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Enable";

  const icon = "bi-check-lg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
