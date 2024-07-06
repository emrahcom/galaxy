<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Disable";

  const icon = "bi-x-lg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
