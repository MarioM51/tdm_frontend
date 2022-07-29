<script lang="ts">
  import { querystring } from "svelte-spa-router";
  import MdWarning from "svelte-icons/md/MdWarning.svelte";
  import FaCheck from "svelte-icons/fa/FaCheck.svelte";
  import { AuthPanel } from "../04_viewModel/auth/AuthPanel";
  import type UserModel from "../01_model/UserModel";
  import type IAuthViewModel from "../04_viewModel/auth/IAuthViewModel";
  import AuthViewModel from "../04_viewModel/auth/AuthViewModel";
  import FormUserAdditionalInfo from "./FormUserAdditionalInfo.svelte";
  import RouteUtiles from "../../common/utils/RouteUtiles";
  import ButtonAsyncAction from "../../common/ButtonAsyncAction.svelte";

  let showingPanel: AuthPanel = AuthPanel.LOGIN;
  let userForm: UserModel = null;
  let errorMessage: string = "";
  let txtBtnForm: string;
  let isOptionalsOpen: boolean = true;
  const params = RouteUtiles.getParams($querystring);

  if (showingPanel == AuthPanel.LOGIN) {
    txtBtnForm = "Login";
  } else {
    txtBtnForm = "Register";
  }

  const authMV: IAuthViewModel = AuthViewModel.getInstance();
  authMV.setPanel(showingPanel);
  const successMsg = authMV.getSuccessMessage();
  const authResp = authMV.getRequestUser();

  authMV.getUserToLogin().subscribe((u) => {
    if (u != null) {
      showingPanel = AuthPanel.LOGIN;
      userForm = u;
      txtBtnForm = "Login";
    }
  });

  authMV.getUserToRegister().subscribe((u) => {
    if (u != null) {
      showingPanel = AuthPanel.REGISTER;
      userForm = u;
      txtBtnForm = "Register";
    }
  });

  authMV.getErrorMessage().subscribe((errMsg) => {
    errorMessage = errMsg;
  });
</script>

<section>
  <div class="auth-container">
    {#if params.get("msg") == "session_expired"}
      <p class="text-center mb-4">Sesion expirada</p>
    {/if}
    {#if params.get("msg") == "session_required"}
      <p class="text-center mb-4">Autenticacion requerida</p>
    {/if}
    <div class="flex">
      <div class="card card-bordered mx-auto w-full sm:w-2/3 max-w-2xl">
        <div class="card-body bg-base-200 p-8">
          <div class="tabs mx-auto">
            <button
              on:click={() => authMV.setPanel(AuthPanel.LOGIN)}
              class="tab tab-bordered {showingPanel == AuthPanel.LOGIN &&
                'tab-active'}">Login</button
            >
            <button
              on:click={() => authMV.setPanel(AuthPanel.REGISTER)}
              class="tab tab-bordered {showingPanel == AuthPanel.REGISTER &&
                'tab-active'}">Register</button
            >
          </div>

          <div class="login-form mb-7">
            <div class="form-control">
              <label class="label" for="email">
                <span class="label-text">Email</span>
              </label>
              <input
                bind:value={userForm.email}
                type="text"
                placeholder="example@mail.com"
                class="input"
                id="email"
              />
            </div>

            <div class="form-control">
              <label class="label" for="password">
                <span class="label-text">Password</span>
              </label>
              <input
                bind:value={userForm.password}
                type="password"
                class="input"
                id="password"
              />
            </div>

            {#if showingPanel == AuthPanel.REGISTER}
              <div class="form-control">
                <label class="label" for="password-confirm">
                  <span class="label-text">Confirm password</span>
                </label>
                <input
                  bind:value={userForm.confirmPass}
                  type="password"
                  class="input"
                  id="password-confirm"
                />
              </div>

              <div
                class="collapse bg-base-300 mt-4 {isOptionalsOpen
                  ? 'collapse-close'
                  : 'collapse-open'}"
              >
                <div
                  on:click={() => {
                    isOptionalsOpen = !isOptionalsOpen;
                  }}
                  class="collapse-title font-medium z-10 cursor-pointer"
                >
                  + Optionals
                </div>
                <input type="checkbox" />

                <div class="collapse-content">
                  <FormUserAdditionalInfo user={userForm} />
                </div>
              </div>
            {/if}
          </div>
          <div class="card-actions justify-end">
            <ButtonAsyncAction
              obs={authResp}
              letShowError={false}
              label={txtBtnForm}
              onAct={() => authMV.onSubmit()}
              clases="btn btn-primary"
            />
          </div>
          {#if errorMessage != ""}
            <div
              class="alert alert-warning mx-auto w-2/3 opacity-60 rounded-none"
            >
              <div class="flex-1">
                <div class="icon">
                  <MdWarning />
                </div>
                <span>{errorMessage}</span>
              </div>
            </div>
          {/if}

          {#if $successMsg != ""}
            <div
              class="alert alert-success mx-auto w-2/3 opacity-60 rounded-none"
            >
              <div class="flex-1">
                <div class="icon">
                  <FaCheck />
                </div>
                <span>{$successMsg}</span>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .icon {
    max-width: 32px;
  }
</style>
