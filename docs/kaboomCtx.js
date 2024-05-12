import kaboom from "https://unpkg.com/kaboom@3000/dist/kaboom.mjs";

const k = kaboom({
    global: false,
    touchToMouse: true,
    canvas: document.getElementById("game"),
});

export default k;
