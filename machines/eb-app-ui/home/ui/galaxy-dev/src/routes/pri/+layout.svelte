<script lang="ts">
  const KRATOS_FQDN = window.localStorage.getItem("kratos_fqdn");
  const loginUrl = `https://${KRATOS_FQDN}/self-service/login/browser`;
  const identity_id = window.sessionStorage.getItem("identity_id");

  if (!identity_id) window.location.replace(loginUrl);
</script>

<!-- -------------------------------------------------------------------------->
<slot />
