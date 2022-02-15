<script lang="ts">
  import identity from "$lib/stores/kratos/identity";
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-primary"
  type="button"
  data-bs-toggle="offcanvas"
  data-bs-target="#offcanvasAccount"
  aria-controls="offcanvasAccount"
>
  <span class="bi bi-person" />
</button>

<div
  class="offcanvas offcanvas-end"
  tabindex="-1"
  id="offcanvasAccount"
  aria-labelledby="offcanvasAccountLabel"
>
  <div class="offcanvas-header bg-light">
    <h5 class="offcanvas-title text-muted" id="offcanvasAccountLabel">
      {$identity.traits.email}
    </h5>

    <button
      type="button"
      class="btn-close text-reset"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    />
  </div>

  <div class="offcanvas-body">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="/settings">Settings</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/logout">Log Out</a>
      </li>
    </ul>
  </div>
</div>
