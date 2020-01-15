const nsList = {
    html: 'http://www.w3.org/1999/xhtml',
    svg: 'http://www.w3.org/2000/svg',
    mathml: 'http://www.w3.org/1998/mathml'
}

export function create() {
    const [ type, ...args ] = arguments

    const ns = type.indexOf('-'); // 'svg-path'
    const el = ns > -1
        ? document.createElementNS(nsList[type.substring(0, ns)], type.substring(ns + 1))
		: /^frag/.test(type)
			? document.createDocumentFragment()
			: document.createElement(type);

    const [ parent, body, props ] = args.reduce((arr, arg) => {
        if (arg instanceof Element || arg instanceof DocumentFragment) arr[0] = arg // parentNode
        else if (typeof arg === 'boolean') arr[1] = arg && document.body // true | false
        else arr[2] = arg; // {}
        return arr
    }, [])

    props && addProps(el, props);
    (parent || body) && (parent || body).appendChild(el)
    return el
}

export function listen(e, n, f, b) {
    b = b || false;
    const arr = typeof e === 'string' ? [e] : e
    const list = n instanceof Element || n === window || n === document ? [n] : n
    arr.forEach( ev => {
        list.forEach(el => {
            el.addEventListener(ev, f, b)
            el.unListen = el.unListen || {}
            el.unListen[ev] = () => el.removeEventListener(ev, f, b)
        })
    })
}

function addProps(obj, o) {
    Object.entries(o).forEach( ([ key, val ]) => {

        const keys = key.split('.')

        keys.reduce( (obj, key, i) => {
            if (/style|dataset/.test(key)) {
                Object.keys(o[key]).map( k => {
                    obj[key][k] = o[key][k]
                })
            }
            else if (/attr/.test(key)) {
                Object.keys(o[key]).map( k => {
                    obj.setAttribute(k, o[key][k])
                })
            }
            else if (key === 'listen') {
                listen(o[key].event, obj, o[key].func, o[key].bubbles)
            }
            else if (key === 'on') {
                Object.entries(o[key]).map(([ event, func ]) => {
                    listen(event, obj, func, false)
                })
            }
            else if (/^(func|callback|cb|ready)$/.test(key)) {
                listen('DOMNodeInserted', obj, cb.bind(null, o[key], obj), true)

                function cb(func, node) {
                    node.unListen.DOMNodeInserted();
                    func(node);
                }
            }
            else if (/^(done|inserted)$/.test(key)) {
                listen('DOMNodeInsertedIntoDocument', obj, cb.bind(null, o[key], obj), true)
                function cb(func, node) {
                    node.unListen.DOMNodeInsertedIntoDocument();
                    func(node);
                }
            }            
            else if (key === 'before') {
			   	o[key](obj);
            }
            else if (/^child/.test(key)) {
                const children = Array.isArray(o[key]) ? o[key] : [ o[key] ];
                children.forEach(c => {
                    const type = c.type || 'div';
                    delete c.type;
                    create(type, obj, c);
                });
            }
            else {
                obj[key] = obj[key] || (i + 1 < keys.length ? {} : val)
            }

            return obj[key]

        }, obj)
    })

    return obj
}