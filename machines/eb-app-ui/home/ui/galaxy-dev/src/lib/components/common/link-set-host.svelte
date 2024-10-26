<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Set member level to host" }: Props = $props();

  const icon = "bi-arrow-bar-up";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
