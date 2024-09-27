<script lang="ts">
  import LinkButton from "$lib/components/common/template-link.svelte";

  export let href: string;
  export let title = "Call";

  const icon = "bi-telephone";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
