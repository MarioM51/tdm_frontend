<script lang="ts">
  import { BlogModel } from "./blog_models";

  const blogs = BlogModel.fromArrayJsonLDInDocument();

  function string_to_slug(str: string): string {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  }
</script>

<section>
  <h1 class="text-2xl font-bold underline">Blogs</h1>
  <div class="blogs">
    {#each blogs as b}
      <a href="/blogs/{string_to_slug(b.title) + '-' + b.id}">
        <article class="card sm:card-side bg-base-300 shadow-lg mb-16">
          <figure>
            <img
              class="w-[355.5px] h-[200px]"
              src="/api/blogs/{b.id}/image?updateAt={b.updateAt}"
              alt="Album"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{b.title}</h2>

            <p>{b.abstract}</p>
            <div class="flex flex-col">
              <span>Created: <kbd class="kbd kbd-sm">{b.createdAt}</kbd></span>
              <span>Updated: <kbd class="kbd kbd-sm">{b.updateAt}</kbd></span>
            </div>
          </div>
        </article>
      </a>
    {/each}
  </div>
</section>

<style>
  @import "/static/tailwin.css";
  .blogs {
    margin-top: 2rem;
  }
</style>
