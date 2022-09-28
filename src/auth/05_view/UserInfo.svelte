<script lang="ts">
  import FormUserAdditionalInfo from "./FormUserAdditionalInfo.svelte";
  import Notification from "../../common/Notification.svelte";
  import type IUserViewModel from "../04_viewModel/users/IUserViewModel";
  import UserViewModel from "../04_viewModel/users/UserViewModel";
  import AuthViewModel from "../04_viewModel/auth/AuthViewModel";
  import type IAuthViewModel from "../04_viewModel/auth/IAuthViewModel";
  import { get, Readable } from "svelte/store";
  import ButtonAsyncAction from "../../common/ButtonAsyncAction.svelte";
  import type AlertMessage from "../../common/AlertMessage";

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  let session = authMV.getSession();

  const userMV: IUserViewModel = UserViewModel.getInstance();
  userMV.fetchUserDetails(get(session).id);

  //observes
  const userDetails = userMV.getUserDetails();
  const userDetailsReq = userMV.getUserDetailsRequest();
  const userRequestEdit = userMV.getUserRequestEdit();
  const msg: Readable<AlertMessage> = userMV.getNotification();
</script>

<div>
  <h1 class="text-2xl font-bold underline">User Details</h1>
  <Notification
    {msg}
    onClose={() => {
      userMV.hiddeMotification();
    }}
  />
  {#await $userDetailsReq}
    <button class="btn btn-circle loading btn-disabled" />
  {:then _}
    {#if $userDetails != null}
      <ButtonAsyncAction
        obs={userRequestEdit}
        label="Update"
        onAct={() => userMV.editUserDetails()}
        clases="btn btn-primary my-3 max-w-xs"
      />

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
