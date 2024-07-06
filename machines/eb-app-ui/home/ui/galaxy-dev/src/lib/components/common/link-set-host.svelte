<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Set member level to host";

  const icon = "bi-person-up";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
