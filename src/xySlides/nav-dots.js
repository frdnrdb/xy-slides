import { create, listen } from './dom';

export default (root, _) => {
    const nav = create('div', root, {
        className: 'xyslides-nav',
        innerHTML: `
            <div data-nav-x="1" class="horizontal">${_.slides.map(() => '<i></i>').join('')}</div>
            <div data-nav-y="1" class="vertical"></div>
            <!-- <i data-nav-z="1" class="minimap-trigger"></i> -->
        `
    });

    const [ navX, navY ] = Array.from(nav.children);

    const renderVerticalNav = index => {
        navY.innerHTML = Array(_.max.y[index]).fill()
            .map(() => `<i></i>`)
            .join('');
    };

    _.setActiveNav = () => {
        Array.from(nav.querySelectorAll('.on')).forEach(n => n.className = '');
        navX.children[_.current.x].classList.add('on');
        navY.children[_.current.y[_.current.x]].classList.add('on');
    };

    const elementIndex = child => Array.prototype.indexOf.call(child.parentElement.children, child);

    listen(
        _.clickEvents,
        nav,
        e => {
            if (_.abortEvent(e)) return;
            if (e.target.nodeName !== 'I') return;

            const x = e.target.parentElement.dataset.navX;
            const oldIndex = elementIndex((x ? navX : navY).querySelector('.on'));
            const newIndex = elementIndex(e.target);

            const navDirection = x ? 'x' : 'y';
            const navValue = oldIndex - newIndex;

            _.navigateTo(navDirection, navValue);
        }
    );

    renderVerticalNav(0);

    _.setActiveNav();
    _.updateBreadcrumbs = index => renderVerticalNav(index);

    return nav;
};
