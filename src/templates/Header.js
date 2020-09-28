const Header = () => {
    const view =`
        <div class="Header-main">
            <div class="Header-logo">
                <h1>
                    <a href="/">
                        Home
                    </a>
                </h1>
            </div>
            <div class="Header-nav">
                <a href="#/error404/">
                    Error 404
                </a>
            </div>
        </div>
    `;
    return view;
};

export default Header;