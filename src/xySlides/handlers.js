export default (root, container, _) => {
    const transformProp =  typeof document.documentElement.style.transform === 'string'
        ? 'transform'
        : 'WebkitTransform';

    const exceeds = (dir, val) => {
        const x =  dir === 'x';
        const max = x ? _.max.x : _.max.y[_.current.x];
        const current = x ? _.current.x : _.current.y[_.current.x];
        const intended = current - (val || _.change[_.direction]);
        return intended < 0 || intended > max - 1;
    };

    const navigateTo = (dir, val, instant, eventType) => {
        val = Number(val);
        if (!dir || !val || _.exceeds(dir, val)) return;
        _.direction = dir;
        _.change[dir] = val;
        _.total[dir] = _.movementThreshold + 1;
        _.touchEndController(null, instant, true, eventType);
    };

    const navigateToPosition = (x, y, smooth) => {
        if (!isNaN(x)) {
            const X = x -  _.current.x;
            navigateTo('x', -1 * X, !smooth);
        }
        if (!isNaN(y)) {
            const Y = y - _.current.y[_.current.x];
            navigateTo('y', -1 * Y, !smooth);
        }
    };

    function touchStartController(e) {
        _.prev.x = e.touches[0].pageX;
        _.prev.y = e.touches[0].pageY;
        _.direction = false;
        _.touchTimer = -new Date().getTime();
    }

    function touchEndController(___, instant, bypassThreshold, eventType = 'Swipe') {
        _.touchTimer += new Date().getTime();

        if (!_.direction) return;
        !instant && root.classList.add(_.transitionClass);

        // accept longer drag if dragtime exceeds movementThresholdTimer
        const durationDependentThreshold = _.movementThreshold * (!bypassThreshold && _.touchTimer > _.movementThresholdTimer ? 2 : 1);

        // fall back to current slide if movement is less than threshold, reset measurements
        ['x', 'y'].forEach(xy => (
            Math.abs(_.total[xy]) < durationDependentThreshold && (_.change[xy] = 0),
            _.total[xy] = 0
        ));

        const y = _.direction === 'y';
        const x = _.current.x;
        const prevY = _.current.y[x];

        // check intended navigation against limits
        const intended = (y ? prevY : x) - _.change[_.direction];
        const max = y ? _.max.y[x] : _.max.x;
        const actual = _.change[_.direction] < 0
            ? Math.min(intended, max - 1)
            : Math.max(intended, 0);

        if (isNaN(actual)) {
            return;
        }

        // update current slide index value
        y ? _.current.y[_.current.x] = actual : _.current.x = actual;

        // set new transform property
        const element = y ? _.slides[x] : container;
        const multiplier = y ? _.H : _.W;
        _.movement[_.direction] = -1 * actual * multiplier;

        element.style[transformProp] = `translate${_.direction}(${_.movement[_.direction]}px)`;

        // reset y navigation at x-index change
        if (_.current.x !== x) {
            setTimeout(() => _.slides[x].style[transformProp] = '', _.transitionDuration);
            _.current.y[x] = 0;
            _.movement.y = 0;
            _.updateBreadcrumbs(actual);
            root.dataset.y = 'first';
        }

        // add nav extremes css hooks
        root.dataset[_.direction] = !actual ? 'first' : actual === max - 1 ? 'last' : '';

        const changed = (Math.abs(_.change.x) + Math.abs(_.change.y)) && intended === actual;

        if (instant || changed) {
            _.setActiveNav();
            _.navState = {
                status: instant ? undefined : eventType,
                direction: _.direction,
                position: [ _.current.x, _.current.y[_.current.x] ],
                element: _.slides[_.current.x].children[_.current.y[_.current.x]],
                previousElement: _.slides[x].children[prevY],
                adjacentElements: [
                    _.current.y[_.current.x] + 1 < _.max.y[_.current.x]
                        && _.slides[_.current.x].children[_.current.y[_.current.x] + 1], // next y
                    _.current.x + 1 < _.max.x
                        && _.slides[_.current.x + 1].children[0], // next x
                ]
            };
            _.emitters.change && _.emitters.change(_.navState);          
        }
    }

    let tx, ty, dx, dy;

    function touchController(e) {
        e.preventDefault(); // prevent pull-to-refresh
        e.stopImmediatePropagation();
        e.stopPropagation();

        ty = e.touches[0].pageY;
        tx = e.touches[0].pageX;
        dy = Math.abs(_.prev.y - ty);
        dx = Math.abs(_.prev.x - tx);
        _.distance.y = (_.prev.y > ty ? -1 : 1) * dy;
        _.distance.x = (_.prev.x > tx ? -1 : 1) * dx;
        _.total.y += _.distance.y;
        _.total.x += _.distance.x;
        _.change.y =  _.total.y < 1 ? -1 : 1;
        _.change.x = _.total.x < 1 ? -1 : 1;

        // set once to ensure dragging in one direction only
        if (!_.direction) {
            _.direction = Math.abs(_.total.y) > Math.abs(_.total.x) ? 'y' : 'x';
        }

        const element = _.direction === 'y'
            ? _.slides[_.current.x]
            : container;

        _.movement[_.direction] += Math.round(_.distance[_.direction]/_.dragClamp);

        requestAnimationFrame(() => {
            element.style[transformProp] = `translate${_.direction}(${_.movement[_.direction]}px)`;
        });

        _.prev.y = ty;
        _.prev.x = tx;
    }

    container.addEventListener('transitionend', e => {
        if (e.propertyName === 'transform') {
            root.classList.remove(_.transitionClass);
        }
    });

    Object.assign(_, { 
        touchStartController, 
        touchEndController, 
        touchController, 
        exceeds, 
        navigateTo, 
        navigateToPosition 
    });
}
