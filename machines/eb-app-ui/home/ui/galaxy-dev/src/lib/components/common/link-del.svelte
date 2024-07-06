<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Delete";

  const icon = "bi-trash";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
