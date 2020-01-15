import './style.scss';
import state from './state';
import navDots from './nav-dots';
import navClick from './nav-click';
import navDesktop from './nav-desktop';
import navKeyboard from './nav-keyboard';
import initHandlers from './handlers';

const initState = container => {
    const slides = Array.from(container.children);
    state.current.y = Array(slides.length).fill(0);
    state.max.x = slides.length;
    state.max.y = slides.map(x => x.children.length);
    state.slides = slides;
};

const initViewport = () => {
    (function resetScroll() {
        scrollTo(0, 0);
        window.onbeforeunload = resetScroll;
    })();

    window.addEventListener('resize', function () {
        if (Math.abs(window.orientation) === 90) {
            document.body.classList.add('landscape');
        }
        if (window.orientation == 0) {
            document.body.classList.remove('landscape');
        }
    }, true);        
};

const initNotifiers = () => {
    const subscribers = {};
    const emitters = {
        change: state => {
            subscribers.change.forEach(s => s(state));
        }
    };
    return {
        emitters,
        add: (event, callback) => {
            if (!emitters[event]) return;
            state.emitters[event] = emitters[event];
            subscribers[event] = subscribers[event] || [];
            subscribers[event].push(callback);
            if (event === 'change') {
                emitters.change(state.navState);
            }
        }
    };
};

export default (container, settings = {}) => {
    const root = container.parentElement;
    root.classList.add('xyslides-container');

    state.showCursor = settings.showCursor || true;

    initState(container);
    initViewport();
    initHandlers(root, container, state);

    document.body.addEventListener('touchmove', state.touchController, { passive: false });
    document.body.addEventListener('touchend', state.touchEndController);
    document.body.addEventListener('touchstart', state.touchStartController);

    const nav = navDots(root, state);
    navClick(root, nav, state);

    navKeyboard(state);

    if (state.isDesktop) {
        navDesktop(root, nav, state);
    }

    settings.position
        ? state.navigateToPosition(...settings.position)
        : state.touchEndController(null, 'init');

    const notify = initNotifiers();

    return {
        state,
        on: notify.add,
        navigateTo: state.navigateToPosition,
        getPosition: () => state.navState.position
    };
};