import xySlides from './xySlides';
import { randomNumber, randomColor, randomEmoji } from './demo';

document.body.innerHTML = `
    <div id="demo" class="xyslides horizontal">
        ${Array(randomNumber(10, 3)).fill().map((_, x) => `
            <div class="xyslides vertical">
                ${Array(randomNumber(10, 3)).fill().map((_, y) => `
                    <div style="background:${randomColor()};">${x} ${randomEmoji()} ${y}</div>
                `).join('')}
            </div>`).join('')}
    </div>
`;

const el = document.getElementById('demo');

const navigation = xySlides(el); 

navigation.on('change', console.log);

// optionally set start position via second argument at init: xySlides(node, { position: [ x, y ] })
// navigation.getPosition() ---> [ x, y ]
// navigation.navigateTo(x, y)