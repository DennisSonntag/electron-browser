<script lang="ts">
  export let title: string
  export let id: string
  import { draggable } from '../lib/dnd'
</script>

<div use:draggable={id} class="w-full h-fit p-1 rounded-md bg-slate-400 hover:bg-slate-300">
  {title}
</div>
