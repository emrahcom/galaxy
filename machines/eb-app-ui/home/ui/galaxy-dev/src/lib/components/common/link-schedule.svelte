<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  export let href: string;
  export let title = "Show schedules";

  const icon = "bi-clock";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
