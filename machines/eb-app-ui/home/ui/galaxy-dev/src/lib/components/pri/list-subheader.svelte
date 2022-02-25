<script lang="ts">
  export let href: string;
  export let subheader: string;
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="row mx-auto" style="max-width:1080px;">
    <div class="col">
      <h3 class="text-muted">{subheader}</h3>
    </div>
    <div class="col text-end">
      <a class="btn btn-outline-secondary" role="button" {href}>
        <span class="bi bi-plus-lg" />
      </a>
    </div>
  </div>
</section>
