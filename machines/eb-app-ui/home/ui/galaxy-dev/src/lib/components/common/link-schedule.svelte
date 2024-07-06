<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Show schedules";

  const icon = "bi-clock";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
