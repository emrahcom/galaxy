<script lang="ts">
  function closeMenu() {
    let closeButton = document.getElementById("closeMenuButton");

    if (closeButton) closeButton.click();
  }
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-primary"
  type="button"
  data-bs-toggle="offcanvas"
  data-bs-target="#offcanvasMenu"
  aria-controls="offcanvasMenu"
  aria-label="Menu"
>
  <i class="bi bi-list"></i>
</button>

<div
  class="offcanvas offcanvas-end"
  id="offcanvasMenu"
  aria-labelledby="offcanvasMenuLabel"
>
  <div class="offcanvas-header bg-light">
    <h5 class="offcanvas-title text-muted" id="offcanvasMenuLabel">Menu</h5>

    <button
      type="button"
      class="btn-close text-reset"
      id="closeMenuButton"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
  </div>

  <div class="offcanvas-body">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a
          class="nav-link"
          href="/pri/calendar"
          on:click|preventDefault={() => {
            closeMenu();
            globalThis.location.href = "/pri/calendar";
          }}
        >
          Calendar
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="/pri/meeting"
          on:click|preventDefault={() => {
            closeMenu();
            globalThis.location.href = "/pri/meeting";
          }}
        >
          Meetings
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="/pri/room"
          on:click|preventDefault={() => {
            closeMenu();
            globalThis.location.href = "/pri/room";
          }}
        >
          Rooms
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="/pri/domain"
          on:click|preventDefault={() => {
            closeMenu();
            globalThis.location.href = "/pri/domain";
          }}
        >
          Domains
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="/pri/profile"
          on:click|preventDefault={() => {
            closeMenu();
            globalThis.location.href = "/pri/profile";
          }}
        >
          Profiles
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="/pri/contact"
          on:click|preventDefault={() => {
            closeMenu();
            globalThis.location.href = "/pri/contact";
          }}
        >
          Contacts
        </a>
      </li>
    </ul>
  </div>
</div>
