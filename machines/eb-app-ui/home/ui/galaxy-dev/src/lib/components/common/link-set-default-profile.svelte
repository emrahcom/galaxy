<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Set as default profile";

  const icon = "bi-person-check";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
