<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  const { href, title = "Disable" }: Props = $props();

  const icon = "bi-x-lg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
