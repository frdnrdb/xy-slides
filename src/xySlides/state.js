const isDesktop = !('ontouchstart' in window);

const getH = () => document.documentElement.pageHeight || window.innerHeight;
const getW = () => document.documentElement.pageWidth || window.innerWidth;

const state = {
    setW() {
        this.W = getW();
    },
    setH() {
		this.H = getH();
    },
    
    W: getW(),
    H: getH(),

    dragClamp: 2,
    movementThreshold: getW() * 0.1,
    movementThresholdTimer: 250,
    transitionClass: 'smooth-transition',
    transitionDuration: 350,

    isDesktop,
    clickEvents: isDesktop ? [ 'mousedown', 'mouseup' ] : [ 'touchstart', 'touchmove', 'touchend' ],
    abortEvent: (() => {
        let abort = false;
        return e => {
            if (e.type === 'touchstart' || e.type === 'mousedown') {
                abort = false;
                return true;
            }
            if (e.type === 'touchmove') {
                abort = true;
                return true;
            }
            return abort;
        };
    })(),

    emitters: {},

    current: {
        x: 0,
        y: undefined,
    },
    max: {
        x: undefined,
        y: undefined
    },
    prev: {
        x: 0,
        y: 0
    },
    distance: {
        x: 0,
        y: 0
    },
    total: {
        x: 0,
        y: 0
    },
    change: {
        x: 0,
        y: 0
    },
    movement: {
        x: 0,
        y: 0
    },
    direction: 'y'
};

export default state;
