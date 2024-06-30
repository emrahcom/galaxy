<script lang="ts">
  let username = "";

  // ---------------------------------------------------------------------------
  function updateUsername() {
    username = window.localeStorage.getItem("identity_email") || "";
  }

  // ---------------------------------------------------------------------------
  function closeMenu() {
    let closeButton = document.getElementById("closeAccountButton");

    if (closeButton) closeButton.click();
  }
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-primary"
  type="button"
  data-bs-toggle="offcanvas"
  data-bs-target="#offcanvasAccount"
  aria-controls="offcanvasAccount"
  on:click={updateUsername}
>
  <span class="bi bi-person" />
</button>

<div
  class="offcanvas offcanvas-end"
  id="offcanvasAccount"
  aria-labelledby="offcanvasAccountLabel"
>
  <div class="offcanvas-header bg-light">
    <h5 class="offcanvas-title text-muted" id="offcanvasAccountLabel">
      {username}
    </h5>

    <button
      type="button"
      class="btn-close text-reset"
      id="closeAccountButton"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    />
  </div>

  <div class="offcanvas-body">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a
          class="nav-link"
          href="/id/settings"
          target="_blank"
          rel="noopener noreferrer"
          on:click={closeMenu}
        >
          Settings
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/logout" on:click={closeMenu}> Log Out </a>
      </li>
    </ul>
  </div>
</div>
