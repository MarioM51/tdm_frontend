<script lang="ts">
  export let propertie: string;
</script>

<div class="form-control mb-4">
  <div class="label">
    <span class="label-text">{propertie}: </span>
  </div>
  <div class="input-group">
    <button class="btn btn-square">
      <slot name="icon">No Icon</slot>
    </button>
    <span class="text-lg overflow-x-auto">
      <slot name="value">No propertie defined</slot>
    </span>
  </div>
</div>
