<script lang="ts">
  import { BlogModel } from "./blog_models";

  const b = BlogModel.fromJsonLDInDocument();
</script>

<article>
  <div class="flex flex-col justify-center sm:flex-row sm:justify-between bg-base-300">
    <div class="m-4 max-w-2xl sm:max-w-[45%]">
      <h1 class="text-5xl font-bold">{b.title}</h1>
      <p class="py-6 text-center">{b.abstract}</p>
    </div>

    <figure class="mx-auto sm:mx-0">
      <img class="w-full h-[200px]" src={b.buildImgURL()} alt="Album" />
    </figure>
  </div>
  <div class="blog_body bg-base-200 pt-8 pb-16 mb-16">
    {@html b.body}
  </div>
</article>

<style>
  @import "/static/tailwin.css";
  @import "/static/blog_content.css";
</style>
