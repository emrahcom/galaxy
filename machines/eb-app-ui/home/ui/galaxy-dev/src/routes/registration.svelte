<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("registration");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import { APP } from "$lib/config";
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/form.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
<section class="container-fluid" id="registration">
  {#if dm.instanceOf === "KratosForm"}
    <div class="row justify-content-center">
      <div class="col text-center" style="max-width:540px;">
        <form>
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="email"
            />
            <label for="email">Email</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="password"
            />
            <label for="password">Password</label>
          </div>

          <div class="form-floating mb-3">
            <button type="submit" class="btn btn-secondary">Sign Up</button>
          </div>
        </form>

        <!-- <Form {dm} groups={["default", "password"]} /> -->

        <hr class="divider" />

        <section class="alternative-actions">
          <a href="{APP}/login">Already have an account? Log in instead</a>
        </section>
      </div>
    </div>
  {:else}
    <p>Something went wrong</p>
  {/if}
</section>
