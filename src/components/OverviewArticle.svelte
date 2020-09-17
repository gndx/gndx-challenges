<script>
  import converNumber from '../utils/convertNumber.js'
  export let element

  let amount = undefined

  if(element.amount >= 10000 || element.percent >= 10000) {
    amount = converNumber(element.amount)
  }
</script>

<style>
  article {
    border-radius: 5px;
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  article p.icono {
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 40px;
  }
  article .data {
    width: 100%;
    height: 42px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  article .data strong {
    font-size: 2.5em;
    color: var(--color-text);
  }
  article .data .success,
  article .data .danger {
    display: flex;
    align-items: center;
  }
  article .data .success span,
  article .data .danger span {
    margin-left: 5px;
    font-weight: bold;
  }

  @media screen and (min-width: 900px) {
    article:hover {
      background-color: var(--color-article-hover);
    }
  }

  @media screen and (min-width: 1200px) {
	article {
		width: 23.5%;
	}
}
</style>

<article>
  <p class="icono">
    <span>{element.name}</span>
    <img src={element.icono} alt={element.name}>
  </p>

  <div class="data">
    <strong>{amount ? amount : element.amount}</strong>
    <div class={element.status === 'increase' ? 'success' : 'danger'}>
      <img src={element.status === 'increase' ? '/images/icon-up.svg' : '/images/icon-down.svg'} alt="Down Icon">
      <span>{element.percent}%</span>
    </div>
  </div>
</article>