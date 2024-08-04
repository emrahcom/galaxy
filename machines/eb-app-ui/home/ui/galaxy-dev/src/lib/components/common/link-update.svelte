<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Update";

  const icon = "bi-pencil";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
