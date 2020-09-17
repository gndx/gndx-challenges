<script>
	import {onMount} from 'svelte'
  import DashboardArticle from './DashboardArticle.svelte';
  import DashboardTitle from './DashboardTitle.svelte'

  let data = []

  onMount(async () => {
    const response = await fetch('https://api-svelte-dashboard.vercel.app/')
    data = await response.json()
  })
  
</script>

<style> 
  @media screen and (min-width: 600px) {
    .con-articles {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
</style>

<section class="dashboard">
  <DashboardTitle />

  <div class="con-articles">
    {#each data as element}
      <DashboardArticle {element} />
    {/each}
  </div>
</section>