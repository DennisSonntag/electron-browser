<script lang="ts">
  import { onMount } from 'svelte'
  import { dropzone } from '../lib/dnd'

  const { send } = window.electron.ipcRenderer

  let tabSection: HTMLDivElement

  function handleResize(windowWidth: number, windowHeight: number) {
    send('resize-browserview', {
      x: tabSection.clientWidth,
      y: 0,
      width: windowWidth - tabSection.clientWidth,
      height: windowHeight
    })
  }

  onMount(() => {
    const { innerWidth, innerHeight } = window
    handleResize(innerWidth, innerHeight)
  })

  window.addEventListener('resize', (event) => {
    const { innerHeight, innerWidth } = event.currentTarget as Window
    handleResize(innerWidth, innerHeight)
  })
</script>

<div use:dropzone bind:this={tabSection} class="bg-slate-700 h-screen w-40 flex flex-col gap-1 p-1">
  <slot />
</div>
