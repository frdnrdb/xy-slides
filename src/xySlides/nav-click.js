import { create, listen } from './dom';

export default (root, nav, _) => {

    create('div', nav, {
        className: 'xyslides-click-nav',
        innerHTML: `
            <div class="nav-trigger" data-nav-direction="y" data-nav-value="1"></div>
            <div class="nav-trigger" data-nav-direction="x" data-nav-value="1"></div>
            <div class="nav-trigger" data-nav-direction="y" data-nav-value="-1"></div>
            <div class="nav-trigger" data-nav-direction="x" data-nav-value="-1"></div>
        `,
        ready: node => {
            root.dataset.x = 'first';
            root.dataset.y = 'first';

            listen(
                _.clickEvents,
                node,
                e => {
                    if (_.abortEvent(e)) return;
                    if (!_.isDesktop && _.touchTimer > 10) return;
                    const { navDirection, navValue } = e.target.dataset;
                    _.navigateTo(navDirection, navValue, undefined, 'Click');
                }
            );
        }
    });

};
