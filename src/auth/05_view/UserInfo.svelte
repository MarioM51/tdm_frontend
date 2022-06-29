<script lang="ts">
  import FormUserAdditionalInfo from "./FormUserAdditionalInfo.svelte";
  import type IUserViewModel from "../04_viewModel/users/IUserViewModel";
  import UserViewModel from "../04_viewModel/users/UserViewModel";
  import AuthViewModel from "../04_viewModel/auth/AuthViewModel";
  import type IAuthViewModel from "../04_viewModel/auth/IAuthViewModel";
  import { get } from "svelte/store";

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  let session = authMV.getSession();

  const userMV: IUserViewModel = UserViewModel.getInstance();
  userMV.fetchUserDetails(get(session).id);

  //observes
  const userDetails = userMV.getUserDetails();
  const userDetailsReq = userMV.getUserDetailsRequest();
  const userRequestEdit = userMV.getUserRequestEdit();
</script>

<div>
  <h1 class="text-2xl font-bold underline">User Details</h1>
  {#await $userDetailsReq}
    <button class="btn btn-circle loading btn-disabled" />
  {:then _}
    {#if $userDetails != null}
      {#await $userRequestEdit}
        <button class="btn btn-primary disabled loading">Update</button>
      {:then _}
        <button
          class="btn btn-primary"
          on:click={() => {
            userMV.editUserDetails();
          }}>Update</button
        >
      {/await}

      <div class="bg-base-200 p-4">
        <FormUserAdditionalInfo user={$userDetails} />
      </div>
    {:else}
      Initial
    {/if}
  {:catch err}
    Error: {err.cause}
  {/await}
</div>

<style>
  .icon {
    height: 32px;
    width: 32px;
  }
</style>
