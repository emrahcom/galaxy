<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Set member level to host";

  const icon = "bi-arrow-bar-up";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
