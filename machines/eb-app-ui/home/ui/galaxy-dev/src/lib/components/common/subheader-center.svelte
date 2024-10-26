<script lang="ts">
  interface Props {
    subheader: string;
  }

  let { subheader }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex justify-content-center">
    <h3 class="text-muted text-center">{subheader}</h3>
  </div>
</section>
