<script lang="ts">
  import { onMount } from 'svelte'
  import Tab from './components/Tab.svelte'
  import TabContainer from './components/TabContainer.svelte'

  const ipcRenderer = window.electron.ipcRenderer
  let localTabs = []

  // onMount(() => {
  //   ipcRenderer.on('tab-list', (_event, data) => {
  //     localTabs = data
  //     return data
  //   })
  // })
  //
  function handleClick() {
    ipcRenderer.send('new-tab', {
      title: 'Amazon',
      url: 'https://amazon.com'
    })

    ipcRenderer.on('tab-list', (_event, data) => {
      localTabs = data
    })
  }
</script>

<button class="w-fit h-fit text-white font-bold" type="button" on:click={handleClick}>Add</button>

<TabContainer>
  {#each localTabs as tab}
    <Tab title="dick" id="fuck" />
  {/each}
</TabContainer>
