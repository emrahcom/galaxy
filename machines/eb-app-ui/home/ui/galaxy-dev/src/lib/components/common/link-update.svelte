<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Update" }: Props = $props();

  const icon = "bi-pencil";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
