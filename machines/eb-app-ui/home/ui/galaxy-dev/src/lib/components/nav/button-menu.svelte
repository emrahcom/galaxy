<script lang="ts">
  function closeMenu() {
    let closeButton = document.getElementById("closeButton");

    closeButton.click();
  }
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-primary"
  type="button"
  data-bs-toggle="offcanvas"
  data-bs-target="#offcanvasMenu"
  aria-controls="offcanvasMenu"
>
  <span class="bi bi-list" />
</button>

<div
  class="offcanvas offcanvas-end"
  tabindex="-1"
  id="offcanvasMenu"
  aria-labelledby="offcanvasMenuLabel"
>
  <div class="offcanvas-header bg-light">
    <h5 class="offcanvas-title text-muted" id="offcanvasMenuLabel">Menu</h5>

    <button
      type="button"
      class="btn-close text-reset"
      id="closeButton"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    />
  </div>

  <div class="offcanvas-body">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="/pri/profiles" on:click={closeMenu}>
          Profiles
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/pri/domains" on:click={closeMenu}>
          Domains
        </a>
      </li>
    </ul>
  </div>
</div>
