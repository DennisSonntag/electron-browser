import type { Action } from "svelte/action";

export const draggable: Action<HTMLElement, any> = (node: HTMLElement, data) => {
  let state = data;
  node.draggable = true;
  node.style.cursor = "grab";

  function handleDragStart(event: DragEvent) {
    event.dataTransfer.setData('text/plain', state)

  }

  node.addEventListener("dragstart", handleDragStart)

  return {
    update(data) {
      state = data
    },
    destroy() {
      node.removeEventListener("dragstart", handleDragStart)
    }
  }

}

export const dropzone: Action<HTMLElement, any> = (node: HTMLElement, options) => {
  let state = {
    dropEffect: 'move',
    dragOverClass: 'droppable',
    ...options
  };

  function handleDragEnter(event: DragEvent) {
    (event.target as HTMLElement).classList.add(state.dragOverClass)
  }

  node.addEventListener("dragenter", handleDragEnter)

  function handleDragLeave(event: DragEvent) {
    (event.target as HTMLElement).classList.remove(state.dragOverClass)
  }

  node.addEventListener("dragleave", handleDragEnter)


}
