<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Enable";

  const icon = "bi-check-lg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
