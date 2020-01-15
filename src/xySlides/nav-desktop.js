import { create } from './dom';

export default (root, nav, _) => {
    root.classList.add('desktop');

    const showCursor = _.showCursor;

    const directionNavContainer = showCursor
        ? create('div', nav, {
            className: 'xyslides-desktop-cursor',
            innerHTML: `
                <div class="cursor-arrow"></div>
            `
        })
        : create('div', nav, {
            className: 'xyslides-desktop-nav-buttons',
            innerHTML: `
                <div class="nav-button y-prev"></div>
                <div class="nav-button x-prev"></div>
                <div class="nav-button y-next"></div>
                <div class="nav-button x-next"></div>
            `
        });

    const C = create('section', root, {
        className: 'scroll-container'
    });

    // Click navigation

    let mouseMoved;
    let moveThrottle = 10;
    const cursor = directionNavContainer.firstElementChild;

    const showButton = click => {
        clearTimeout(mouseMoved);
        !click && (mouseMoved = setTimeout(() => root.classList.remove('show-direction'), 1000));
        root.classList.add('show-direction');
    };

    C.addEventListener('mousedown', () => {
        C.style.display = 'none';
        setTimeout(() => C.style.display = 'block', _.transitionDuration);
        !showCursor && showButton(true)
    });

    C.addEventListener('mousemove', e => {
        if (moveThrottle--) return;
        moveThrottle = 10;

        const x = e.pageX / _.W - .5;
        const y = e.pageY / _.H - .5;
        const vertical = Math.abs(y) > Math.abs(x);
        const next = (vertical ? y : x) > 0;

        if (showCursor) {
            const rotate = 45 * (next ? vertical ? 5 : 3 : vertical ? 1 : -1);
            cursor.className = `cursor-arrow ${vertical ? 'y' : 'x'}-${next ? 'next' : 'prev'}`;
            cursor.setAttribute('style', `transform: translateX(${e.pageX}px) translateY(${e.pageY}px) rotate(${rotate}deg)`);
            return;
        }

        root.dataset.mouseDirection = `${next ? 'next' : 'prev'}-${vertical ? 'y' : 'x'}`;
        showButton();
    });

    // TODO! Add Mousewheel/ Touchpad navigation

    /*
    if (!/chrome/i.test(navigator.userAgent)) return;

    C.classList.add('scroll-container');
    C.insertAdjacentHTML('beforeend', Array(2).fill().map((_, i) => `<div><div></div></div>`).join(''));

    const nextScrollContainer = (() => {

        const first = C.firstElementChild;
        const [ sw, w, sh, h ] = (c => ([
            c.scrollWidth, c.offsetWidth, c.scrollHeight, c.offsetHeight
        ]))(first);
        const centerY = Math.round(sh/2 - h/2);
        const centerX = Math.round(sw/2 - w/2);

        let prev, curr;
        let shifts = 0;

        const next = () => {
            prev = C.children[shifts % 2];
            prev.className = 'prevent';
            prev.dataset.off = true;
            prev.scrollTo(centerX, centerY);

            curr = C.children[++shifts % 2];
            curr.className = '';
            delete curr.dataset.off;
        };

        next();
        Array.from(C.children).forEach(c => c.addEventListener('wheel', onScroll));

        return () => ({
            centerX,
            centerY,
            node: () => curr,
            next
        });
    })();

    const scroller = nextScrollContainer();
    let cx, cy, dx, dy;
    let tx, ty;
    let to;

    function onScroll(e) {
        clearTimeout(to);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const scrl = scroller.node();

        if (!ty) {
            ty = scroller.centerY;
            tx = scroller.centerX;
        }
        to = setTimeout(() => {

            cy = scrl.scrollTop;
            cx = scrl.scrollLeft;
            dy = Math.abs(ty - cy);
            dx = Math.abs(tx - cx);
            _.up = ty > cy;
            _.left = tx > cx;

            const navDirection = dy > dx ? 'y' : 'x';
            const navValue = _.up || _.left ? 1 : -1;

            ty = false;
            tx = false;

            _.navigateTo(navDirection, navValue);

            scroller.next();
        }, 100);
    }
    */

    /*
    const detectTouchPad = () => new Promise(resolve => {
        let timestamp, events = 0;

        const types = ['DOMMouseScroll', 'mousewheel'];
        const listen = add => types.forEach(e => document[`${add ? 'add' : 'remove'}EventListener`](e, handler));
        listen(true);

        function handler() {
            timestamp = timestamp || new Date().getTime();
            events++;
            if (new Date().getTime() - timestamp > 50) {
                listen();
                resolve(events > 5 ? true : false);
            }
        }
    });

    detectTouchPad().then(isTouchPad => console.log('touchpad:', isTouchPad));
    */
};
