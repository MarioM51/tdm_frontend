<script lang="ts">
  export let msg:string = "";
</script>

<div class="ratio_16_9_container">
  <div class="ratio_16_9_content">
    <span>
      {msg}
    </span>
  </div>
</div>

<style>
.ratio_16_9_container {
    background-color: lightgray;
    width: 100%;
    padding-top: 56.25%;
    position: relative;
  }
  .ratio_16_9_content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    display: flex;
    justify-content: center;
  }

  .ratio_16_9_content span {
    color: black;
    margin: auto;
  }

</style>