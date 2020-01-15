document.head.insertAdjacentHTML('beforeend', `<style>
    body {
        background: #333;
    }
    .xyslides.vertical div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: sans-serif;
        color: #fff;
    }
</style>`);

export const randomEmojiRanges = [
    [0x1f600, 0x1f64f], // emoticons
    [0x1f32d, 0x1f37f], // food
    [0x1f400, 0x1f4d3], // animals
    [0x1f910, 0x1f92f] // expressions
];

export const randomEmoji = range => {
    range = range || Math.floor(Math.random() * randomEmojiRanges.length);
    let [max, min] = randomEmojiRanges[range];
    let codePoint = Math.floor(Math.random() * (max - min) + min);
    return String.fromCodePoint(codePoint);
};

export const randomNumber = (max = 100, min = 0) => Math.floor(Math.random() * max) + min;
export const randomColor = () => `rgb(${randomNumber(150, 50)}, ${randomNumber(150, 50)}, ${randomNumber(150, 50)})`;