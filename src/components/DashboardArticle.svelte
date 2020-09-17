<script>
  import converNumber from '../utils/convertNumber.js'
  export let element

  const status = element.status
  
  let followers = undefined

  if(element.followers >= 10000) {
    followers = converNumber(element.followers)
  }
</script>

<style>
  article {
    height: 220px;
    justify-content: space-between;
  }
  article::after {
    content: '';
    position: absolute;
    top: -5px;
    width: 100%;
    height: 5px;
    background: white;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  article p.icono {
    justify-content: center;
  }
  article p.icono span {
    margin-left: 10px;
    line-height: 8px;
  }
  article p.followers {
    font-size: 4em;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  article p.followers strong {
    position: relative;
  }
  article p.followers strong::before {
    content: 'FOLLOWERS';
    font-size: 14px;
    font-weight: lighter;
    position: absolute;
    bottom: -14px;
    color: var(--color-text-morado);
    letter-spacing: 4px;
    left: 50%;
    transform: translateX(-50%);
  }
  article p.article-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
  article p.article-footer span {
    margin-left: 5px;
  }

  article.facebook::after {
    background-color: var(--color-border-facebook);
  }
  article.twitter::after {
    background-color:  var(--color-border-twitter);
  }
  article.instagram::after {
    background:  var(--color-border-instagram);
  }
  article.youtube::after {
    background-color:  var(--color-border-youtube);
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

<article class={element.type}>
  <p class="icono">
    <img
      src={element.icono}
      alt={element.icono}
    />
    <span>{element.user}</span>
  </p>

  <p class="followers">
    <strong>{followers ? followers : element.followers}</strong>
  </p>

  <p class={status === 'increase' ? 'article-footer success' : 'article-footer danger'}>
    <img src={status === 'increase' ? '/images/icon-up.svg' : '/images/icon-down.svg'} alt="Icon up" />
    <span>{element.amount} Today</span>
  </p>
</article>