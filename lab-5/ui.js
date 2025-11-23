import { store } from './store.js';

let container;
let squareCount;
let circleCount;

export function initUI() {
    console.log('initUI started');
    container = document.getElementById('shapes-container');
    squareCount = document.getElementById('square-count');
    circleCount = document.getElementById('circle-count');

    if (!container || !squareCount || !circleCount) {
        console.error('DOM elements not found!', { container, squareCount, circleCount });
        return;
    }
    store.subscribe(render);

    console.log('Initial render with state:', store.state);
    render(store.state);

    document.getElementById('add-square').addEventListener('click', () => {
        console.log('Click add-square');
        store.addShape('square');
    });

    document.getElementById('add-circle').addEventListener('click', () => {
        console.log('Click add-circle');
        store.addShape('circle');
    });

    document.getElementById('recolor-squares').addEventListener('click', () => {
        store.recolorShapes('square');
    });

    document.getElementById('recolor-circles').addEventListener('click', () => {
        store.recolorShapes('circle');
    });

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('shape')) {
            const id = e.target.dataset.id;
            console.log('Removing shape', id);
            store.removeShape(id);
        }
    });
}

function render(state) {
    console.log('Render called with state:', state);
    const counts = store.getCounts();
    squareCount.textContent = counts.squares;
    circleCount.textContent = counts.circles;

    const currentIds = Array.from(container.children).map(el => el.dataset.id);
    const newIds = state.shapes.map(s => s.id);

    Array.from(container.children).forEach(el => {
        if (!newIds.includes(el.dataset.id)) {
            el.remove();
        }
    });

    state.shapes.forEach(shape => {
        let el = container.querySelector(`.shape[data-id="${shape.id}"]`);

        if (!el) {
            el = document.createElement('div');
            el.classList.add('shape', shape.type);
            el.dataset.id = shape.id;
            container.appendChild(el);
        }

        el.style.backgroundColor = shape.color;
    });
}
