<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";

  interface Props {
    disabled?: boolean;
    id: string;
    label: string;
    options: string[][];
    required?: boolean;
    value: string;
  }

  let {
    disabled = false,
    id,
    label,
    options: _options,
    required = true,
    value = $bindable(),
  }: Props = $props();

  // Filter out duplicated options
  const options = $derived.by(() => {
    const map = new SvelteMap<string, string[]>();

    for (const opt of _options) {
      map.set(opt[0], opt);
    }

    return [...map.values()];
  });
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <select
    class="form-select"
    {id}
    bind:value
    aria-label={label}
    {disabled}
    {required}
  >
    <option class="bg-body"></option>

    {#each options as opt (opt[0])}
      <option value={opt[0]}>{opt[1] || ""}</option>
    {/each}
  </select>
  <label for={id}>{label}</label>
</div>
