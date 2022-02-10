<nav class="navbar navbar-light bg-light fixed-top shadow">
  <div class="container-fluid">
    <a class="navbar-brand py-0" href="/">
      <img src="/logo.svg" alt="logo" height="50rem" />
    </a>

    <button
      class="navbar-toggler ms-auto me-3"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasMenu"
      aria-controls="offcanvasMenu"
    >
      <span class="bi bi-list" />
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasMenu">
      <div class="offcanvas-header justify-content-end">
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link" href="/cp/domain">Domains</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/cp/room">Rooms</a>
          </li>
        </ul>
      </div>
    </div>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasUser"
      aria-controls="offcanvasUser"
    >
      <span class="bi bi-person" />
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasUser">
      <div class="offcanvas-header justify-content-end">
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link" href="/settings">Settings</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/logout">Log Out</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
