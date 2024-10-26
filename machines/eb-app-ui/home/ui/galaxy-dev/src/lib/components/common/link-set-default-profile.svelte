<script lang="ts">
  import LinkButton from "$lib/components/common/template-link-button.svelte";

  interface Props {
    href: string;
    title?: string;
  }

  let { href, title = "Set as default profile" }: Props = $props();

  const icon = "bi-person-check";
</script>

<!-- -------------------------------------------------------------------------->
<LinkButton {href} {icon} {title} />
