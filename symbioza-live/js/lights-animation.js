// lights-animation.js
document.addEventListener('DOMContentLoaded', () => {
    const lights = document.querySelectorAll('.light');
    lights.forEach((light, i) => {
        light.style.animationDelay = `${i * 0.66}s`;
    });
});