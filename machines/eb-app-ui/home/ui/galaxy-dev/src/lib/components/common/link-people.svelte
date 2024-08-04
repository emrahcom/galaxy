<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Show partners";

  const icon = "bi-people";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
