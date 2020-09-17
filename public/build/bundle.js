
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function converNumber(number) {
    	let data = number.toString();
    	data = data.substr(0, 2);

    	return data + 'k'
    }

    /* src/components/DashboardArticle.svelte generated by Svelte v3.25.1 */
    const file = "src/components/DashboardArticle.svelte";

    function create_fragment(ctx) {
    	let article;
    	let p0;
    	let img0;
    	let img0_src_value;
    	let img0_alt_value;
    	let t0;
    	let span0;
    	let t1_value = /*element*/ ctx[0].user + "";
    	let t1;
    	let t2;
    	let p1;
    	let strong;

    	let t3_value = (/*followers*/ ctx[1]
    	? /*followers*/ ctx[1]
    	: /*element*/ ctx[0].followers) + "";

    	let t3;
    	let t4;
    	let p2;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let span1;
    	let t6_value = /*element*/ ctx[0].amount + "";
    	let t6;
    	let t7;
    	let p2_class_value;
    	let article_class_value;

    	const block = {
    		c: function create() {
    			article = element("article");
    			p0 = element("p");
    			img0 = element("img");
    			t0 = space();
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			strong = element("strong");
    			t3 = text(t3_value);
    			t4 = space();
    			p2 = element("p");
    			img1 = element("img");
    			t5 = space();
    			span1 = element("span");
    			t6 = text(t6_value);
    			t7 = text(" Today");
    			if (img0.src !== (img0_src_value = /*element*/ ctx[0].icono)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", img0_alt_value = /*element*/ ctx[0].icono);
    			add_location(img0, file, 93, 4, 1894);
    			attr_dev(span0, "class", "svelte-10varyk");
    			add_location(span0, file, 97, 4, 1962);
    			attr_dev(p0, "class", "icono svelte-10varyk");
    			add_location(p0, file, 92, 2, 1872);
    			attr_dev(strong, "class", "svelte-10varyk");
    			add_location(strong, file, 101, 4, 2026);
    			attr_dev(p1, "class", "followers svelte-10varyk");
    			add_location(p1, file, 100, 2, 2000);

    			if (img1.src !== (img1_src_value = /*status*/ ctx[2] === "increase"
    			? "/images/icon-up.svg"
    			: "/images/icon-down.svg")) attr_dev(img1, "src", img1_src_value);

    			attr_dev(img1, "alt", "Icon up");
    			add_location(img1, file, 105, 4, 2188);
    			attr_dev(span1, "class", "svelte-10varyk");
    			add_location(span1, file, 106, 4, 2292);

    			attr_dev(p2, "class", p2_class_value = "" + (null_to_empty(/*status*/ ctx[2] === "increase"
    			? "article-footer success"
    			: "article-footer danger") + " svelte-10varyk"));

    			add_location(p2, file, 104, 2, 2097);
    			attr_dev(article, "class", article_class_value = "" + (null_to_empty(/*element*/ ctx[0].type) + " svelte-10varyk"));
    			add_location(article, file, 91, 0, 1839);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, p0);
    			append_dev(p0, img0);
    			append_dev(p0, t0);
    			append_dev(p0, span0);
    			append_dev(span0, t1);
    			append_dev(article, t2);
    			append_dev(article, p1);
    			append_dev(p1, strong);
    			append_dev(strong, t3);
    			append_dev(article, t4);
    			append_dev(article, p2);
    			append_dev(p2, img1);
    			append_dev(p2, t5);
    			append_dev(p2, span1);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*element*/ 1 && img0.src !== (img0_src_value = /*element*/ ctx[0].icono)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*element*/ 1 && img0_alt_value !== (img0_alt_value = /*element*/ ctx[0].icono)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (dirty & /*element*/ 1 && t1_value !== (t1_value = /*element*/ ctx[0].user + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*followers, element*/ 3 && t3_value !== (t3_value = (/*followers*/ ctx[1]
    			? /*followers*/ ctx[1]
    			: /*element*/ ctx[0].followers) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*element*/ 1 && t6_value !== (t6_value = /*element*/ ctx[0].amount + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*element*/ 1 && article_class_value !== (article_class_value = "" + (null_to_empty(/*element*/ ctx[0].type) + " svelte-10varyk"))) {
    				attr_dev(article, "class", article_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DashboardArticle", slots, []);
    	let { element } = $$props;
    	const status = element.status;
    	let followers = undefined;

    	if (element.followers >= 10000) {
    		followers = converNumber(element.followers);
    	}

    	const writable_props = ["element"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DashboardArticle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("element" in $$props) $$invalidate(0, element = $$props.element);
    	};

    	$$self.$capture_state = () => ({ converNumber, element, status, followers });

    	$$self.$inject_state = $$props => {
    		if ("element" in $$props) $$invalidate(0, element = $$props.element);
    		if ("followers" in $$props) $$invalidate(1, followers = $$props.followers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, followers, status];
    }

    class DashboardArticle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardArticle",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*element*/ ctx[0] === undefined && !("element" in props)) {
    			console.warn("<DashboardArticle> was created without expected prop 'element'");
    		}
    	}

    	get element() {
    		throw new Error("<DashboardArticle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<DashboardArticle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DashboardTitle.svelte generated by Svelte v3.25.1 */

    const { Object: Object_1 } = globals;
    const file$1 = "src/components/DashboardTitle.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div0;
    	let h2;
    	let t1;
    	let p0;
    	let t3;
    	let div3;
    	let p1;
    	let t4;
    	let t5;
    	let div2;
    	let div1;
    	let div2_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Social Media Dashboard";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Total Followers: 23,004";
    			t3 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t4 = text(/*text*/ ctx[1]);
    			t5 = space();
    			div2 = element("div");
    			div1 = element("div");
    			add_location(h2, file$1, 106, 4, 2251);
    			attr_dev(p0, "class", "svelte-1es9g7p");
    			add_location(p0, file$1, 107, 4, 2287);
    			attr_dev(div0, "class", "title svelte-1es9g7p");
    			add_location(div0, file$1, 105, 2, 2227);
    			attr_dev(p1, "class", "toggle-text svelte-1es9g7p");
    			add_location(p1, file$1, 111, 4, 2355);
    			attr_dev(div1, "class", "button svelte-1es9g7p");
    			add_location(div1, file$1, 113, 6, 2513);
    			attr_dev(div2, "class", "toggle-btn svelte-1es9g7p");

    			attr_dev(div2, "style", div2_style_value = /*style*/ ctx[0].darkMode
    			? ""
    			: "justify-content: flex-end !important;");

    			add_location(div2, file$1, 112, 4, 2393);
    			attr_dev(div3, "class", "toggle svelte-1es9g7p");
    			add_location(div3, file$1, 110, 2, 2330);
    			attr_dev(div4, "class", "dash-title svelte-1es9g7p");
    			add_location(div4, file$1, 104, 0, 2200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*toggle*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 2) set_data_dev(t4, /*text*/ ctx[1]);

    			if (dirty & /*style*/ 1 && div2_style_value !== (div2_style_value = /*style*/ ctx[0].darkMode
    			? ""
    			: "justify-content: flex-end !important;")) {
    				attr_dev(div2, "style", div2_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function addTheme(theme) {
    	const styles = document.documentElement.style;
    	const customStyles = Object.keys(theme);

    	for (const style of customStyles) {
    		styles.setProperty(style, theme[style]);
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DashboardTitle", slots, []);
    	let style = { darkMode: true };
    	let text = "Light Mode";

    	const darkTheme = {
    		"--color-bg": "#1e202a",
    		"--color-article": "#252a41",
    		"--color-article-hover": "#63687e80",
    		"--color-text": "#ffffff"
    	};

    	const lightTheme = {
    		"--color-bg": "#eeeeee",
    		"--color-article": "#d4d8e7",
    		"--color-article-hover": "#d6dbf0",
    		"--color-text": "#1e202a"
    	};

    	function toggle() {
    		$$invalidate(0, style.darkMode = !style.darkMode, style);

    		if (style.darkMode) {
    			addTheme(darkTheme);
    			$$invalidate(1, text = "Light Mode");
    		} else {
    			addTheme(lightTheme);
    			$$invalidate(1, text = "Dark Mode");
    		}
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DashboardTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		style,
    		text,
    		darkTheme,
    		lightTheme,
    		toggle,
    		addTheme
    	});

    	$$self.$inject_state = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [style, text, toggle];
    }

    class DashboardTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardTitle",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/Dashboard.svelte generated by Svelte v3.25.1 */
    const file$2 = "src/components/Dashboard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (29:4) {#each data as element}
    function create_each_block(ctx) {
    	let dashboardarticle;
    	let current;

    	dashboardarticle = new DashboardArticle({
    			props: { element: /*element*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dashboardarticle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboardarticle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dashboardarticle_changes = {};
    			if (dirty & /*data*/ 1) dashboardarticle_changes.element = /*element*/ ctx[1];
    			dashboardarticle.$set(dashboardarticle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboardarticle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboardarticle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboardarticle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(29:4) {#each data as element}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let dashboardtitle;
    	let t;
    	let div;
    	let current;
    	dashboardtitle = new DashboardTitle({ $$inline: true });
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(dashboardtitle.$$.fragment);
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "con-articles svelte-12353mj");
    			add_location(div, file$2, 27, 2, 551);
    			attr_dev(section, "class", "dashboard");
    			add_location(section, file$2, 24, 0, 499);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(dashboardtitle, section, null);
    			append_dev(section, t);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboardtitle.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboardtitle.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(dashboardtitle);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dashboard", slots, []);
    	let data = [];

    	onMount(async () => {
    		const response = await fetch("https://api-svelte-dashboard.vercel.app/");
    		$$invalidate(0, data = await response.json());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		DashboardArticle,
    		DashboardTitle,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/OverviewArticle.svelte generated by Svelte v3.25.1 */
    const file$3 = "src/components/OverviewArticle.svelte";

    function create_fragment$3(ctx) {
    	let article;
    	let p;
    	let span0;
    	let t0_value = /*element*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let img0;
    	let img0_src_value;
    	let img0_alt_value;
    	let t2;
    	let div1;
    	let strong;

    	let t3_value = (/*amount*/ ctx[1]
    	? /*amount*/ ctx[1]
    	: /*element*/ ctx[0].amount) + "";

    	let t3;
    	let t4;
    	let div0;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let span1;
    	let t6_value = /*element*/ ctx[0].percent + "";
    	let t6;
    	let t7;
    	let div0_class_value;

    	const block = {
    		c: function create() {
    			article = element("article");
    			p = element("p");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			img0 = element("img");
    			t2 = space();
    			div1 = element("div");
    			strong = element("strong");
    			t3 = text(t3_value);
    			t4 = space();
    			div0 = element("div");
    			img1 = element("img");
    			t5 = space();
    			span1 = element("span");
    			t6 = text(t6_value);
    			t7 = text("%");
    			attr_dev(span0, "class", "svelte-p7sj1l");
    			add_location(span0, file$3, 60, 4, 1133);
    			if (img0.src !== (img0_src_value = /*element*/ ctx[0].icono)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", img0_alt_value = /*element*/ ctx[0].name);
    			add_location(img0, file$3, 61, 4, 1165);
    			attr_dev(p, "class", "icono svelte-p7sj1l");
    			add_location(p, file$3, 59, 2, 1111);
    			attr_dev(strong, "class", "svelte-p7sj1l");
    			add_location(strong, file$3, 65, 4, 1243);

    			if (img1.src !== (img1_src_value = /*element*/ ctx[0].status === "increase"
    			? "/images/icon-up.svg"
    			: "/images/icon-down.svg")) attr_dev(img1, "src", img1_src_value);

    			attr_dev(img1, "alt", "Down Icon");
    			add_location(img1, file$3, 67, 6, 1372);
    			attr_dev(span1, "class", "svelte-p7sj1l");
    			add_location(span1, file$3, 68, 6, 1486);

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*element*/ ctx[0].status === "increase"
    			? "success"
    			: "danger") + " svelte-p7sj1l"));

    			add_location(div0, file$3, 66, 4, 1299);
    			attr_dev(div1, "class", "data svelte-p7sj1l");
    			add_location(div1, file$3, 64, 2, 1220);
    			attr_dev(article, "class", "svelte-p7sj1l");
    			add_location(article, file$3, 58, 0, 1099);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, p);
    			append_dev(p, span0);
    			append_dev(span0, t0);
    			append_dev(p, t1);
    			append_dev(p, img0);
    			append_dev(article, t2);
    			append_dev(article, div1);
    			append_dev(div1, strong);
    			append_dev(strong, t3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, img1);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && img0.src !== (img0_src_value = /*element*/ ctx[0].icono)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*element*/ 1 && img0_alt_value !== (img0_alt_value = /*element*/ ctx[0].name)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (dirty & /*amount, element*/ 3 && t3_value !== (t3_value = (/*amount*/ ctx[1]
    			? /*amount*/ ctx[1]
    			: /*element*/ ctx[0].amount) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*element*/ 1 && img1.src !== (img1_src_value = /*element*/ ctx[0].status === "increase"
    			? "/images/icon-up.svg"
    			: "/images/icon-down.svg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*element*/ 1 && t6_value !== (t6_value = /*element*/ ctx[0].percent + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*element*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*element*/ ctx[0].status === "increase"
    			? "success"
    			: "danger") + " svelte-p7sj1l"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("OverviewArticle", slots, []);
    	let { element } = $$props;
    	let amount = undefined;

    	if (element.amount >= 10000 || element.percent >= 10000) {
    		amount = converNumber(element.amount);
    	}

    	const writable_props = ["element"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OverviewArticle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("element" in $$props) $$invalidate(0, element = $$props.element);
    	};

    	$$self.$capture_state = () => ({ converNumber, element, amount });

    	$$self.$inject_state = $$props => {
    		if ("element" in $$props) $$invalidate(0, element = $$props.element);
    		if ("amount" in $$props) $$invalidate(1, amount = $$props.amount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, amount];
    }

    class OverviewArticle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverviewArticle",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*element*/ ctx[0] === undefined && !("element" in props)) {
    			console.warn("<OverviewArticle> was created without expected prop 'element'");
    		}
    	}

    	get element() {
    		throw new Error("<OverviewArticle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<OverviewArticle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Overview.svelte generated by Svelte v3.25.1 */
    const file$4 = "src/components/Overview.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (31:4) {#each data as element}
    function create_each_block$1(ctx) {
    	let overviewarticle;
    	let current;

    	overviewarticle = new OverviewArticle({
    			props: { element: /*element*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overviewarticle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overviewarticle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overviewarticle_changes = {};
    			if (dirty & /*data*/ 1) overviewarticle_changes.element = /*element*/ ctx[1];
    			overviewarticle.$set(overviewarticle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overviewarticle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overviewarticle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overviewarticle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:4) {#each data as element}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let h2;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Overview - Today";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-14jwu6k");
    			add_location(h2, file$4, 27, 2, 524);
    			attr_dev(div, "class", "con-articles svelte-14jwu6k");
    			add_location(div, file$4, 29, 2, 553);
    			attr_dev(section, "class", "overview svelte-14jwu6k");
    			add_location(section, file$4, 26, 0, 495);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Overview", slots, []);
    	let data = [];

    	onMount(async () => {
    		const response = await fetch("https://api-svelte-dashboard.vercel.app/overview");
    		$$invalidate(0, data = await response.json());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Overview> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, OverviewArticle, data });

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Overview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overview",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.25.1 */
    const file$5 = "src/App.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let div;
    	let dashboard;
    	let t;
    	let overview;
    	let current;
    	dashboard = new Dashboard({ $$inline: true });
    	overview = new Overview({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(dashboard.$$.fragment);
    			t = space();
    			create_component(overview.$$.fragment);
    			attr_dev(div, "class", "container");
    			add_location(div, file$5, 134, 1, 2567);
    			add_location(main, file$5, 133, 0, 2559);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(dashboard, div, null);
    			append_dev(div, t);
    			mount_component(overview, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			transition_in(overview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			transition_out(overview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(dashboard);
    			destroy_component(overview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Dashboard, Overview });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
