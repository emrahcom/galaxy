<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  const { href, title = "Enable" }: Props = $props();

  const icon = "bi-check-lg";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
