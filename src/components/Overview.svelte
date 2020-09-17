<script>
	import {onMount} from 'svelte'
  import OverviewArticle from "./OverviewArticle.svelte";

  let data = []

  onMount(async () => {
    const response = await fetch('https://api-svelte-dashboard.vercel.app/overview')
    data = await response.json()
  })

</script>

<style>
  section.overview h2 {
    margin: 20px 0;
  }
  @media screen and (min-width: 600px) {
    .con-articles {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
</style>

<section class="overview">
  <h2>Overview - Today</h2>

  <div class="con-articles">
    {#each data as element}
      <OverviewArticle {element} />
    {/each}
  </div>
</section>