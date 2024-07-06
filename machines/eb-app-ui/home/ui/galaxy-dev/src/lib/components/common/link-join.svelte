<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Join";

  const icon = "bi-link-45deg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
