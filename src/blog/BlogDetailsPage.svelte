<script lang="ts">
  import { BlogModel } from "./blog_models";
  import ReviewsClient from "../comments/CommentsClient.svelte";
  import CommentModel from "../comments/CommentModel";
  import { BlogService } from "./BlogService";

  const blog = BlogModel.fromJsonLDInDocument();
  const comments = blog.comments.map((b) => CommentModel.fromBlogComment(b));
  const blogServ = BlogService.getInstance();
</script>

<article>
  <div
    class="flex flex-col justify-center sm:flex-row sm:justify-between bg-base-300"
  >
    <div class="m-4 max-w-2xl sm:max-w-[45%]">
      <h1 class="text-3xl font-bold">{blog.title}</h1>
      <p class="py-6 text-center">{blog.abstract}</p>
    </div>

    <figure class="img_ratio_16_9_container mx-auto sm:mx-0">
      <img
        class="img_ratio_16_9_content w-full sm:h-[200px]"
        src={blog.imageUrl}
        alt="Album"
      />
    </figure>
  </div>
  <div class="blog_body bg-base-200 pt-8 pb-16 px-2 mb-16">
    {@html blog.body}
  </div>
  <ReviewsClient {comments} idTarget={blog.id} commentServ={blogServ} />
</article>

<style>
  @import "/static/tailwin.css";
  @import "/static/blog_content.css";

  @media screen and (min-width: 641px) {
    /* desktop */
    .img_ratio_16_9_container {
      width: 60%;
      max-width: 500px;
    }

    .img_ratio_16_9_content {
      width: 100%;
      height: 100%;
    }
  }

  @media screen and (max-width: 640px) {
    /* portable */
    .img_ratio_16_9_container {
      width: 100%;
      padding-top: 56.25%;
      position: relative;
    }

    .img_ratio_16_9_content {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
</style>
