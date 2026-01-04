<script lang="ts">
  import LinkButton from "$lib/components/common/template-link.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  const { href, title = "Join" }: Props = $props();

  const icon = "bi-link-45deg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
