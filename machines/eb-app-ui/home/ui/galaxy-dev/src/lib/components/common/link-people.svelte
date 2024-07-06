<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Partners";

  const icon = "bi-people";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
