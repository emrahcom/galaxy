<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Delete" }: Props = $props();

  const icon = "bi-trash";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
