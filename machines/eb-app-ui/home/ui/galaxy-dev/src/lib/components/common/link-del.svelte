<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Delete";

  const icon = "bi-trash";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
