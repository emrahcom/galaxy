<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Update";

  const icon = "bi-pencil";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
