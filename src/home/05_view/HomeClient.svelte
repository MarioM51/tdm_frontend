<script>
  import ProductStorePage from "../../product/05_view/ProductStorePage.svelte";
  import BlogListPage from "../../blog/BlogListPage.svelte";
  import About from "./About.svelte";
</script>

<main>
  <h1 class="text-3xl font-bold mb-8">Tienda De Mario</h1>

  <ProductStorePage onHomeScreen={true} />
  <div class="flex justify-end">
    <a href="/products" class="link link-primary text-base font-bold"
      >Ver mas productos -></a
    >
  </div>

  <div class="divider" />

  <About />

  <div class="divider" />

  <BlogListPage onHomeScreen={true} />
  <div class="flex justify-end">
    <a href="/blogs" class="link link-primary font-bold text-base"
      >Ver mas blogs -></a
    >
  </div>
</main>
