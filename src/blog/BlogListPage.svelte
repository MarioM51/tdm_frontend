<script lang="ts">
  import Like from "../common/Like.svelte";
  import { BlogModel } from "./blog_models";
  import DateUtils from "../common/utils/DateUtils.ts";
  import RouteUtiles from "../common/utils/RouteUtiles.ts";
  
  const blogs = BlogModel.fromArrayJsonLDInDocument();
</script>

<section>
  <h1 class="text-2xl font-bold underline">Blogs</h1>
  <div class="blogs">
    {#each blogs as b}
      <article class="card sm:card-side bg-base-300 shadow-lg mb-16">
        <figure>
          <Like type="blogs" id={b.id} amount={b.likes} />
          <a href={b.getSlug()}>
          <img
            src="/api/blogs/{b.id}/image?updateAt={b.updateAt}"
            alt="Album"
          />
          </a>
        </figure>
        <a href={b.getSlug()}>
          <div class="card-body">
            <h2 class="card-title">{b.title}</h2>

            <p>{b.abstract}</p>
            <div class="flex flex-col">
              <span>Created: <kbd class="kbd kbd-sm">{DateUtils.format(b.createdAt)}</kbd></span>
            </div>
          </div>
        </a>
      </article>
    {/each}
  </div>
</section>

<style>
  @import "/static/tailwin.css";
  .blogs {
    margin-top: 2rem;
  }
</style>
