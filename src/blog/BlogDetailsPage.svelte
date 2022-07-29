<script lang="ts">
  import { BlogModel } from "./blog_models";
  import ReviewsClient from "../comments/CommentsClient.svelte";
  import ReviewModel from "../comments/CommentModel";
  import { BlogService } from "./BlogService";

  const blog = BlogModel.fromJsonLDInDocument();
  const comments = blog.comments.map((b) => ReviewModel.fromBlogComment(b));
  const blogServ = BlogService.getInstance();
</script>

<article>
  <div
    class="flex flex-col justify-center sm:flex-row sm:justify-between bg-base-300"
  >
    <div class="m-4 max-w-2xl sm:max-w-[45%]">
      <h1 class="text-5xl font-bold">{blog.title}</h1>
      <p class="py-6 text-center">{blog.abstract}</p>
    </div>

    <figure class="mx-auto sm:mx-0">
      <img class="w-full sm:h-[200px]" src={blog.imageUrl} alt="Album" />
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
</style>
