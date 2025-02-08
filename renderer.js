console.log('hello electron');

let count = 0;

const counter = document.getElementById('count');
counter.innerText = count;

const up = document.getElementById('countUp');
up.addEventListener('click', () => {
    count++;
    counter.innerHTML = count;
});