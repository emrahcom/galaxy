<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Show keys" }: Props = $props();

  const icon = "bi-key";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
