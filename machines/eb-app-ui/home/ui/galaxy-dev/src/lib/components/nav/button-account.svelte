<script lang="ts">
  let username = $state("");

  // ---------------------------------------------------------------------------
  function updateUsername() {
    username = globalThis.localStorage.getItem("identity_email") || "";
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
  aria-label="My account"
  onclick={updateUsername}
>
  <i class="bi bi-person"></i>
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
    ></button>
  </div>

  <div class="offcanvas-body">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a
          class="nav-link"
          href="/id/settings"
          target="_blank"
          rel="noopener noreferrer"
          onclick={closeMenu}
        >
          Settings
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/logout" onclick={closeMenu}> Log Out </a>
      </li>
    </ul>
  </div>
</div>
