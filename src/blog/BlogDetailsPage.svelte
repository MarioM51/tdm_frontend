<script lang="ts">
  import { BlogModel } from "./blog_models";

  const b = BlogModel.fromJsonLDInDocument();
</script>

<article class="bg-base-200">
  <div class="flex flex-col justify-center sm:flex-row sm:justify-between">
    <div>
      <h1 class="text-5xl font-bold sm:ml-4 sm:mt-4">{b.title}</h1>
      <p class="py-6 text-center">{b.abstract}</p>
    </div>

    <figure class="mx-auto sm:mr-4 sm:mt-4">
      <img class="w-[355.5px] h-[200px]" src={b.buildImgURL()} alt="Album" />
    </figure>
  </div>
  <div class="blog_body">
    {@html b.body}
  </div>
</article>

<style>
  @import "/static/tailwin.css";
  @import "/static/blog_content.css";
</style>
