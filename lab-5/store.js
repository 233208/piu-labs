import { getRandomColor, generateId } from './helpers.js';

class Store {
    #state = {
        shapes: []
    };

    #subscribers = new Set();

    constructor() {
        this.loadState();
    }

    get state() {
        return { ...this.#state };
    }

    subscribe(fn) {
        this.#subscribers.add(fn);
        fn(this.state);
        return () => this.#subscribers.delete(fn);
    }

    #notify() {
        for (const cb of this.#subscribers) {
            cb(this.state);
        }
        this.saveState();
    }

    saveState() {
        localStorage.setItem('shapesApp', JSON.stringify(this.#state));
    }

    loadState() {
        const saved = localStorage.getItem('shapesApp');
        if (saved) {
            this.#state = JSON.parse(saved);
        }
    }

    addShape(type) {
        console.log('store.addShape', type);
        const shape = {
            id: generateId(),
            type: type,
            color: getRandomColor()
        };
        this.#state.shapes.push(shape);
        this.#notify();
    }

    removeShape(id) {
        console.log('store.removeShape', id);
        this.#state.shapes = this.#state.shapes.filter(s => s.id !== id);
        this.#notify();
    }

    recolorShapes(type) {
        console.log('store.recolorShapes', type);
        this.#state.shapes.forEach(shape => {
            if (shape.type === type) {
                shape.color = getRandomColor();
            }
        });
        this.#notify();
    }

    getCounts() {
        let squares = 0;
        let circles = 0;
        this.#state.shapes.forEach(s => {
            if (s.type === 'square') squares++;
            if (s.type === 'circle') circles++;
        });
        return { squares, circles };
    }
}

export const store = new Store();
