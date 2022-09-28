<script lang="ts">
  import DateUtils from "../common/utils/DateUtils";
  import Like from "../common/Like.svelte";
  import { BlogModel } from "./blog_models";

  export let onHomeScreen: boolean = false;

  const blogs = BlogModel.fromArrayJsonLDInDocument();
</script>

<section>
  <h1
    class="text-2xl font-bold my-4"
    class:cursor-pointer={onHomeScreen}
    class:underline={onHomeScreen}
    on:click={() => {
      if (onHomeScreen) {
        window.location.href = "/blogs";
      }
    }}
  >
    Blogs
  </h1>

  <div class="blogs">
    {#if blogs.length <= 0}
      <p>No hay blogs principales para mostrar</p>
    {:else}
      {#each blogs as b}
        <article
          class="card sm:card-side bg-base-300 shadow-lg mb-16 last:mb-8 sm:max-h-[280px]"
        >
          <figure class="img_ratio_16_9_container w-full md:max-w-[400px]">
            <Like type="blogs" id={b.id} amount={b.likes} />
            <a href={b.getSlug()}>
              <img
                class="img_ratio_16_9_content"
                src="/api/blogs/{b.id}/image?updateAt={b.updateAt}"
                alt="Album"
              />
            </a>
          </figure>
          <a href={b.getSlug()}>
            <div class="card-body">
              <h2 class="card-title">{b.title}</h2>

              <p>{b.abstract}</p>
              <div class="flex flex-col mt-2">
                <span
                  >Publicado: <kbd class="kbd kbd-sm"
                    >{DateUtils.format(b.createdAt)}</kbd
                  ></span
                >
                <span
                  >Comentarios: <kbd class="kbd kbd-sm">({b.commentCount})</kbd
                  ></span
                >
                <span
                  >Calificacion: <kbd class="kbd kbd-sm">
                    <div class="rating">
                      <input
                        type="radio"
                        name="rating-new-comment"
                        class="mask mask-star-2 bg-orange-400"
                        checked
                      />
                    </div>
                    {b.comments_rating}</kbd
                  ></span
                >
              </div>
            </div>
          </a>
        </article>
      {/each}
    {/if}
  </div>
</section>

<style>
  @import "http://192.168.1.81/static_003/tailwin.css";

  .img_ratio_16_9_container {
    width: 100%;
    padding-top: 56.25%;
    position: relative;
  }
  .img_ratio_16_9_content {
    position: absolute;
    width: 100%;
    max-height: 280px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
