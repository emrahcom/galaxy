<script lang="ts">
  import QRCode from "qrcode";

  interface Props {
    data: string;
  }

  let { data }: Props = $props();

  let canvas: HTMLCanvasElement;

  $effect(() => {
    QRCode.toCanvas(canvas, data);
  });
</script>

<!-- -------------------------------------------------------------------------->
<canvas bind:this={canvas}></canvas>
