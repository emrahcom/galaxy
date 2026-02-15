<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";

  interface Props {
    disabled?: boolean;
    options: string[][];
    value: string;
  }

  let {
    disabled = false,
    options: _options,
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
{#each options as opt (opt[0])}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      bind:group={value}
      id={opt[0]}
      value={opt[0]}
      {disabled}
    />
    <label class="form-check-label" for={opt[0]}>{opt[1] || ""}</label>
  </div>
{/each}
