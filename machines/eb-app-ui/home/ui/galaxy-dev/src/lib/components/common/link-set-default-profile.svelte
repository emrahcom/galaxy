<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Set default profile";

  const icon = "bi-person-check";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
