<script lang="ts">
  import { toCanvas } from "qrcode";

  interface Props {
    data: string;
  }

  const { data }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    toCanvas(canvas, data);
  });
</script>

<!-- -------------------------------------------------------------------------->
<canvas bind:this={canvas}></canvas>
