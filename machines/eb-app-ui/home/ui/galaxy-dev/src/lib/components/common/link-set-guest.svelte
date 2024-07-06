<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Set member level to guest";

  const icon = "bi-arrow-bar-down";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
