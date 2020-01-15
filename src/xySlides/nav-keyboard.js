export default _ => {

    // arrow keys up/down/left/right
    window.onkeyup = e => {
        if (e.keyCode > 40 && e.keyCode < 36) return;
        const navDirection = e.keyCode % 2 === 0 ? 'y' : 'x';
        const navValue = e.keyCode === 37 || e.keyCode === 38 ? 1 : -1;
        _.navigateTo(navDirection, navValue);
    };

};
