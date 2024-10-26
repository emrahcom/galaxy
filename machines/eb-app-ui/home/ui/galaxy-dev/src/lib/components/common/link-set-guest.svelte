<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Set member level to guest" }: Props = $props();

  const icon = "bi-arrow-bar-down";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
