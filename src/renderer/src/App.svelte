<script lang="ts">
  // import TabContainer from "./components/TabContainer.svelte";

  import { dropzone } from "./lib/dnd";
  import Tab from "./components/Tab.svelte";
  import { onMount } from "svelte";

  let tabSection:HTMLDivElement;
  let localTabs = [];


  let width = tabSection?.clientWidth || 0;
  let x = 20;

  // onMount(() => {
  //   let width = Number(
  //     window.getComputedStyle(tabSection).width.replace("px", ""),
  //   );
  //   console.log(width);
  // });

  let expanding = null;
  let start = null,
    initial = null;

  function startExpand(type, event) {
    expanding = type;
    start = event.pageX;
    initial = { x, width };
  }

  function stopExpand() {
    expanding = null;
    start = null;
    initial = null;
  }

  function expand(event) {
    if (!expanding) return;

    if (expanding == "left") {
      const delta = start - event.pageX;
      x = initial.x - delta;
      width = initial.width + delta;
      return;
    }

    if (expanding == "right") {
      const delta = event.pageX - start;
      width = initial.width + delta;
      return;
    }
  }
</script>

<main class="flex w-screen h-screen right-0 relative">
  <div
    use:dropzone
    id="tab"
    class="bg-slate-700 h-screen w-[20%] flex flex-col gap-1 p-1 relative"
    on:mousemove={expand}
  >
    <div>
      {#each localTabs as tab}
        <Tab title="dick" id="fuck" />
      {/each}
    </div>
    <div
      class="h-full w-[5px] absolute right-0 top-0 bg-red-500 cursor-col-resize"
      on:mousedown={startExpand.bind(this, "right")}
      class:active={expanding == "right"}
    ></div>
  </div>
  <webview src="https://www.google.com" class="w-[80%] h-full"></webview>
</main>
