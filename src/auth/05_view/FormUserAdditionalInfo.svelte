<script lang="ts">
  import type UserModel from "../01_model/UserModel";

  export let user: UserModel;
  console.log("user- in details", user);
</script>

<div>
  <div class="form-control">
    <label class="label" for="fullName">
      <span class="label-text">Full Name</span>
    </label>
    <input
      type="text"
      bind:value={user.fullName}
      class="input"
      id="fullName"
      minlength="3"
      maxlength="50"
    />
  </div>

  <div class="form-control">
    <label class="label" for="phone">
      <span class="label-text">Phone</span>
    </label>
    <input
      bind:value={user.phone}
      onKeyUp="(this.value>999999999999999) ? this.value=this.value.substring(0,15) : null;"
      type="number"
      class="input"
      id="phone"
      min="111111"
    />
  </div>

  <div class="form-control">
    <label class="label" for="zip">
      <span class="label-text">Zip Code</span>
    </label>
    <input
      bind:value={user.zip}
      onKeyUp="(this.value>999999) ? this.value=this.value.substring(0,6) : null;"
      type="number"
      class="input"
      id="zip"
      min="1"
      max="999999"
    />
  </div>

  <div class="form-control">
    <label class="label" for="state">
      <span class="label-text">State</span>
    </label>
    <input
      bind:value={user.state}
      type="text"
      class="input"
      id="state"
      minlength="5"
      maxlength="30"
    />
  </div>

  <div class="form-control">
    <label class="label" for="city">
      <span class="label-text">City</span>
    </label>
    <input
      bind:value={user.city}
      type="text"
      class="input"
      id="city"
      minlength="5"
      maxlength="30"
    />
  </div>

  <div class="form-control">
    <label class="label" for="street">
      <span class="label-text">Street</span>
    </label>
    <input
      bind:value={user.street}
      type="text"
      class="input"
      id="street"
      minlength="3"
      maxlength="80"
    />
  </div>

  <div class="form-control">
    <label class="label" for="streetNum">
      <span class="label-text">Street Number</span>
    </label>
    <input
      bind:value={user.streetNum}
      onKeyUp="(this.value>99999) ? this.value=this.value.substring(0,5) : null;"
      type="number"
      class="input"
      id="streetNum"
      min="1"
      max="99999"
    />
  </div>
</div>
