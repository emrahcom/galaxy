<script lang="ts">
  const KRATOS_FQDN = globalThis.localStorage.getItem("kratos_fqdn");
  const loginUrl = `https://${KRATOS_FQDN}/self-service/login/browser`;
  const identity_id = globalThis.localStorage.getItem("identity_id");

  if (!identity_id) globalThis.location.replace(loginUrl);
</script>

<!-- -------------------------------------------------------------------------->
<slot />
