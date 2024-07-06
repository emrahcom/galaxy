<script lang="ts">
  import LinkButton from "$lib/components/common/link-button-template.svelte";

  export let href: string;
  export let title = "Keys";

  const icon = "bi-key";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
