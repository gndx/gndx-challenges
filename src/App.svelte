<script>
	import Dashboard from './components/Dashboard.svelte'
	import Overview from './components/Overview.svelte'
	
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	:global(:root) {
		--text-family: 'Inter', sans-serif;
		--text-size: 14px;

		--color-bg: #1e202a;
		--color-article: #252a41;
    --color-article-hover: #63687e80;
		--color-text: #ffffff;

		--color-text-morado: #8b97c6;
		--color-text-blue: #aeb3cb;
		--color-text-gray: #f0f2fa;
		--color-text-gray-dark: #63687e;

		--color-green: #1db489;
		--color-red: #dc414c;

		--color-border-facebook: #198ff5;
		--color-border-twitter: #1ca0f2;
		--color-border-instagram: linear-gradient(
			to right,
			#dfa549,
			#df4996
		);
		--color-border-youtube: #c4032a;

		--color-toggle: linear-gradient(to right, #378fe6, #3eda82);
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		background-color: var(--color-text-gray-dark);
	}

	:global(::-webkit-scrollbar-track) {
		box-shadow: inset 0 0 10px #00000070;
		border-radius: 5px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: linear-gradient(125deg, var(--color-green), var(--color-red));
		border-radius: 5px;
	}

	:global(body) {
		min-width: 375px;
		font-size: var(--text-size);
		font-family: var(--text-family);
		background-color: var(--color-bg);
		transition: all ease-in-out 0.3s;
	}

	:global(section) {
		width: 100%;
		margin-top: 10px;
		color: var(--color-text-morado);
	}

	:global(p strong, h2) {
		color: var(--color-text);
		transition: all ease-in 0.3s;
	}

	:global(article) {
		background: var(--color-article);
		margin-bottom: 30px;
		border-radius: 0 0 5px 5px;
		padding: 20px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		transition: all ease 0.3s;
	}

	:global(.icono) {
		width: 100%;
		display: flex;
		align-items: center;
		margin-top: 10px;
	}
	
	:global(.border article::after) {
		content: '';
		position: absolute;
		top: -5px;
		width: 100%;
		height: 5px;
		background: var(--color-text);
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	:global(.container) {
		max-width: 1050px;
		width: 95%;
		margin: 0 auto;
		padding: 15px;
	}

	:global(.success) {
		color: var(--color-green);
	}
	:global(.danger) {
		color: var(--color-red);
	}

	:global(.right) {
		justify-content: flex-end !important;
	}

	@media screen and (min-width: 600px) {
		:global(article) {
			width: 48%;
		}
	}
</style>

<main>
	<div class="container">
		<Dashboard />
		<Overview />
	</div>
</main>