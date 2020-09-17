<script>
  let style = {darkMode: true}
  let text = 'Light Mode'

  const darkTheme = {
    '--color-bg': '#1e202a',
    '--color-article': '#252a41',
    '--color-article-hover': '#63687e80',
		'--color-text': '#ffffff',
  };

  const lightTheme = {
    '--color-bg': '#eeeeee',
		'--color-article': '#d4d8e7',
    '--color-article-hover': '#d6dbf0',
		'--color-text': '#1e202a',
  };

  function toggle() {
    style.darkMode = !style.darkMode

    if(style.darkMode) {
      addTheme(darkTheme)
      text = 'Light Mode'
    } else {
      addTheme(lightTheme)
      text = 'Dark Mode'
    }
  }

  function addTheme(theme) {
    const styles = document.documentElement.style;
    
    const customStyles = Object.keys(theme);
    for (const style of customStyles) {
      styles.setProperty(style, theme[style]);
    }
  }
</script>

<style>
  .dash-title .title {
    font-size: 1.2em;
  }
  .dash-title .title p {
    width: 100%;
    font-weight: 700;
    font-size: 14px;
    margin: 5px 0 0;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-text-gray-dark);
  }
  .dash-title .toggle {
    width: 100%;
    height: 30px;
    margin: 20px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dash-title .toggle .toggle-text {
    font-weight: 700;
  }
  .dash-title .toggle .toggle-btn {
    width: 48px;
    height: 24px;
    padding: 5px;
    border-radius: 20px;
    background: var(--color-toggle);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
  }
  .dash-title .toggle .toggle-btn .button {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background-color: var(--color-bg);
    box-shadow: 0 0 5px 1px var(--color-text-gray-dark);
    cursor: pointer;
  }

  @media screen and (min-width: 900px) {
    .dash-title {
      display: flex;
      justify-content: space-between;
    }
    .dash-title .title {
      width: 70%;
    }
    .dash-title .title p {
      border-bottom: none;
    }
    .dash-title .toggle {
      width: 30%;
      justify-content: flex-end;
    }
    .dash-title .toggle .toggle-text {
      margin-right: 10px;
    }
  }
</style>

<div class="dash-title">
  <div class="title">
    <h2>Social Media Dashboard</h2>
    <p>Total Followers: 23,004</p>
  </div>

  <div class="toggle">
    <p class="toggle-text">{text}</p>
    <div class="toggle-btn" on:click={toggle}  style={style.darkMode ? '' : 'justify-content: flex-end !important;'}>
      <div class="button"></div>
    </div>
  </div>
</div>