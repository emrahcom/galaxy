<script lang="ts">
  import LinkButton from "$lib/components/common/template-link.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  const { href, title = "Send message" }: Props = $props();

  const icon = "bi-chat-left-dots";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
