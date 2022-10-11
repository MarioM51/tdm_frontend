<script lang="ts">
  import { LocalBusinessLDJSON } from "../LocalBusinessLDJSON";
  import PropValue from "./PropValue.svelte";
  import IconClock from "../../common/icons/IconClock.svelte";
  import IconPhoneWhats from "../../common/icons/IconPhoneWhats.svelte";
  import IconEmail from "../../common/icons/IconEmail.svelte";

  const localBus = LocalBusinessLDJSON.fromLDJson();
</script>

<section>
  <h2 class="text-2xl font-bold my-4">Informacion general</h2>

  <PropValue propertie="Telefono">
    <svelte:fragment slot="icon"><IconPhoneWhats /></svelte:fragment>
    <svelte:fragment slot="value">{localBus.telephone}</svelte:fragment>
  </PropValue>

  <PropValue propertie="Email">
    <svelte:fragment slot="icon"><IconEmail /></svelte:fragment>
    <svelte:fragment slot="value">{localBus.email}</svelte:fragment>
  </PropValue>

  <PropValue propertie="Ubicacion">
    <svelte:fragment slot="icon"><IconClock /></svelte:fragment>
    <svelte:fragment slot="value">
      <div class="text-lg">
        {localBus.address.addressLocality}
        <a
          target="_blank"
          rel="noopener noreferrer"
          class="link link-accent"
          href="https://www.google.com/maps/place/Museo+De+La+Madera/@{localBus
            .geo.latitude},{localBus.geo
            .longitude},18z/data=!4m8!1m2!3m1!2sMuseo+De+La+Madera!3m4!1s0x85d017ce65cf1925:0x737673b7a6258cc6!8m2!3d19.6164899!4d-98.1208305"
        >
          (Mapa)
        </a><br />
        Calle: {localBus.address.streetAddress} <br />
        Codigo Postal: {localBus.address.postalCode}<br />
      </div>
    </svelte:fragment>
  </PropValue>

  <PropValue propertie="Horario">
    <svelte:fragment slot="icon"><IconClock /></svelte:fragment>
    <svelte:fragment slot="value">
      <ul>
        <li>
          + Lunes a Viernes {localBus.openingHoursSpecification[0].opens} a {localBus
            .openingHoursSpecification[0].opens}
        </li>
        <li>
          + Sabado y Domingo {localBus.openingHoursSpecification[1].opens} a {localBus
            .openingHoursSpecification[1].closes}
        </li>
      </ul>
    </svelte:fragment>
  </PropValue>
</section>
