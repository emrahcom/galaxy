<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Add";

  const icon = "bi-plus";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
