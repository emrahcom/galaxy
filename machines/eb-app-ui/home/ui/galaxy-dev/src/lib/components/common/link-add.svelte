<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  const { href, title = "Add" }: Props = $props();

  const icon = "bi-plus";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
