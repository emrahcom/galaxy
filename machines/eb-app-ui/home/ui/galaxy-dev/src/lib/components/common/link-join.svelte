<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Join";

  const icon = "bi-link-45deg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
