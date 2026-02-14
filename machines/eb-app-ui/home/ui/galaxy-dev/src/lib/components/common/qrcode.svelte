<script lang="ts">
  import { toCanvas } from "qrcode";

  interface Props {
    data: string;
  }

  const { data }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    if (canvas && data) toCanvas(canvas, data);
  });
</script>

<!-- -------------------------------------------------------------------------->
<canvas bind:this={canvas}></canvas>
