<script lang="ts">
  import { Consts } from "../Constants";

  import { onDestroy, onMount } from "svelte";

  import { BlogFormViewModel } from "./BlogFormViewModel";

  export let params: any = {};

  const blogImg = Consts.HOST + "/products/image/";

  const toolbarOptions = [
    [
      { header: [1, 2, 3, 4, false] },
      "bold",
      "italic",
      "underline",
      "strike",
      { align: [] },
      "blockquote",
      { color: [] },
      { background: [] },
    ],
    ["code-block", "video", "image", "link"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ];

  const blogFormMV = BlogFormViewModel.getInstance();

  if (!params.id) {
    throw Error("Id Blog is required");
  }

  let editor;
  let quillInstance;
  onMount(async () => {
    blogFormMV.onInit();
    blogFormMV.findBlogById(params.id);

    const { default: Quill } = await import("quill");

    quillInstance = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
      placeholder: "Write your story...",
    });

    quillInstance;
  });

  const blogOnForm = blogFormMV.getBlogOnForm();
  const blogOnFormReq = blogFormMV.getBlogOnFormReq();
  const blogDeleteReq = blogFormMV.getBlogDeleteReq();
  const errorBlogMsg = blogFormMV.getErrorBlogMsg();

  let filled = false;
  blogOnForm.subscribe((b) => {
    if (b != null && !filled && b.body != "") {
      setTimeout(() => {
        quillInstance?.pasteHTML(b.body);
        filled = true;
      }, 100);
    }
  });

  onDestroy(() => {
    blogFormMV.onDestroy();
  });

  function submit() {
    $blogOnForm.body = quillInstance.root.innerHTML;
    if (params.id == 0) {
      blogFormMV.save();
    } else {
      blogFormMV.edit();
    }
  }

  let files: FileList;

  function previewImage() {
    const fileReader = new FileReader();
    if (files[0] != undefined) {
      fileReader.readAsDataURL(files[0]);
      fileReader.addEventListener("load", function () {
        $blogOnForm.thumbnail = this.result as string;
      });
    } else {
      $blogOnForm.thumbnail = "favicon.ico";
    }
  }

  let isOpenDeleteModal: boolean = false;
</script>

<main>
  {#if $blogOnFormReq != null}
    <div class="mayon">
      <div class="centrado">Loading...</div>
    </div>
  {/if}

  <button class="btn btn-primary" on:click={submit}>
    {params.id > 0 ? "Edit" : "Save"}
  </button>

  {#if params.id > 0}
    <button
      class="btn btn-error"
      on:click={() => {
        isOpenDeleteModal = true;
      }}
    >
      Delete
    </button>
  {/if}

  <div id="inputs" class="sm:w-4/5 m-auto">
    {#if $errorBlogMsg != null}
      <div class="alert alert-error shadow-lg w-full mb-5">
        {$errorBlogMsg}
      </div>
    {/if}

    <div class="form-control w-full mb-5">
      <label class="input-group input-group-md ">
        <span class="min-w-[100px]">Title's blog</span>
        <input
          type="text"
          bind:value={$blogOnForm.title}
          class="input input-bordered input-md w-full"
          style="font-size: 1.6em;"
        />
      </label>
    </div>

    <div class="form-control mb-5 flex flex-row max">
      <input
        type="file"
        class="h-[50px] mt-[2rem]"
        accept="image/*"
        bind:files
        on:change={previewImage}
      />

      <img
        src={$blogOnForm.thumbnail != null
          ? $blogOnForm.thumbnail
          : "favicon.ico"}
        width="270px"
        alt="icon"
        loading="lazy"
        class="max-w-[150px]"
      />
    </div>

    <div class="editor-wrapper">
      <div class="editor" bind:this={editor} />
    </div>
  </div>

  <br />

  <div class="modal" class:modal-open={isOpenDeleteModal}>
    <div class="modal-box">
      Are you sure you want to delete this blog?
      <div class="modal-action">
        {#await $blogDeleteReq}
          <button class="btn loading btn-disabled">Loading</button>
        {:then deleteStatus}
          {#if deleteStatus == null}
            <button
              on:click={() => blogFormMV.deletePost()}
              class="btn btn-error">Delete</button
            >
          {/if}
        {/await}
        <button on:click={() => (isOpenDeleteModal = false)} class="btn"
          >Close</button
        >
      </div>
    </div>
  </div>

  <!-- fin mayon -->
</main>

<style>
  .editor {
    height: 300px;
  }

  .mayon {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 63px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }

  .centrado {
    position: absolute;
    right: 43%;
    top: 8%;
    font-size: 1.3em;
    text-align: center;
    color: white;
  }
</style>
