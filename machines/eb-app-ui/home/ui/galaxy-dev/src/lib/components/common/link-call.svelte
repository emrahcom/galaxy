<script lang="ts">
  import LinkButton from "$lib/components/common/template-link.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Call" }: Props = $props();

  const icon = "bi-telephone";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
