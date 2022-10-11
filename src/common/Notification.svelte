<script lang="ts">
  import type { Readable } from "svelte/store";
  import MdClose from "svelte-icons/md/MdClose.svelte";
  import MdCheck from "svelte-icons/md/MdCheck.svelte";
  import type { VoidAction } from "./types/FuncTypes";
  import type AlertMessage from "./AlertMessage";

  export let msg: Readable<AlertMessage>;
  export let onClose: VoidAction;
</script>

<div
  class="alert alert-success shadow-lg p-1 w-[90%] flex flex-row mb-4 absolute bottom-0 right-3 max-w-xl"
  class:hidden={$msg == null}
>
  <div class="w-full px-4 pt-2">
    <div class="icon-btn mx-3"><MdCheck /></div>
    <div>
      <h3>{$msg?.msg}</h3>
      <!-- <div class="text-xs">You have 1 unread message</div> -->
    </div>
  </div>
  <div class="flex-none">
    <div
      class="icon-btn m-3"
      on:click={() => {
        onClose();
      }}
    >
      <MdClose />
    </div>
  </div>
</div>

<style>
  @import "http://192.168.1.81/static_003/tailwin.css";
  .icon-btn {
    cursor: pointer;
    width: 25px;
    height: 25px;
    margin: 5px;
  }
</style>
