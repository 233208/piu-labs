document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('kanban-board');

    function generateUniqueId() {
        return crypto.randomUUID();
    }

    function generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    function saveState() {
        const state = {
            columns: {}
        };
        document.querySelectorAll('.kanban-column').forEach(column => {
            const columnId = column.id;
            const cards = [];
            column.querySelectorAll('.kanban-card').forEach(card => {
                cards.push({
                    id: card.id,
                    content: card.querySelector('.card-text').textContent,
                    color: card.style.backgroundColor
                });
            });
            state.columns[columnId] = cards;
        });
        localStorage.setItem('kanbanState', JSON.stringify(state));
    }

    function loadState() {
        const stateJSON = localStorage.getItem('kanbanState');
        if (!stateJSON) {
            updateAllCounters();
            return;
        }

        const state = JSON.parse(stateJSON);

        document.querySelectorAll('.card-container').forEach(container => container.innerHTML = '');

        Object.keys(state.columns).forEach(columnId => {
            const columnEl = document.getElementById(columnId);
            if (columnEl) {
                const cardContainer = columnEl.querySelector('.card-container');
                state.columns[columnId].forEach(cardData => {
                    const cardEl = createCardElement(cardData.id, cardData.content, cardData.color);
                    cardContainer.appendChild(cardEl);
                });
            }
        });

        updateAllCounters();
    }

    function updateCardCounter(columnEl) {
        const count = columnEl.querySelectorAll('.kanban-card').length;
        columnEl.querySelector('.card-count').textContent = `Liczba kart: ${count}`;
    }

    function updateAllCounters() {
        document.querySelectorAll('.kanban-column').forEach(updateCardCounter);
    }

    function moveCard(card, direction) {
        const currentColumn = card.closest('.kanban-column');
        let targetColumn;

        if (direction === 'left') {
            targetColumn = currentColumn.previousElementSibling;
        } else {
            targetColumn = currentColumn.nextElementSibling;
        }

        if (targetColumn && targetColumn.classList.contains('kanban-column')) {
            targetColumn.querySelector('.card-container').appendChild(card);
            updateAllCounters();
            saveState();
        }
    }

    function createCardElement(id, content, color) {
        const card = document.createElement('div');
        card.id = id;
        card.className = 'kanban-card';
        card.style.backgroundColor = color;

        const cardText = document.createElement('div');
        cardText.className = 'card-text';
        cardText.contentEditable = true;
        cardText.spellcheck = false;
        cardText.textContent = content;
        cardText.addEventListener('blur', saveState);
        card.appendChild(cardText);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'card-button delete-card-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => {
            const column = card.closest('.kanban-column');
            card.remove();
            updateCardCounter(column);
            saveState();
        });
        card.appendChild(deleteBtn);

        const colorBtn = document.createElement('button');
        colorBtn.className = 'card-button color-card-btn';
        colorBtn.innerHTML = '🎨';
        colorBtn.addEventListener('click', () => {
            card.style.backgroundColor = generateRandomColor();
            saveState();
        });
        card.appendChild(colorBtn);

        const moveLeftBtn = document.createElement('button');
        moveLeftBtn.className = 'card-button move-card-btn left';
        moveLeftBtn.innerHTML = '←';
        moveLeftBtn.addEventListener('click', () => moveCard(card, 'left'));
        card.appendChild(moveLeftBtn);

        const moveRightBtn = document.createElement('button');
        moveRightBtn.className = 'card-button move-card-btn right';
        moveRightBtn.innerHTML = '→';
        moveRightBtn.addEventListener('click', () => moveCard(card, 'right'));
        card.appendChild(moveRightBtn);

        return card;
    }

    function addNewCardToColumn(columnEl) {
        const id = generateUniqueId();
        const color = generateRandomColor();
        const content = 'Nowe zadanie...';
        
        const cardEl = createCardElement(id, content, color);
        columnEl.querySelector('.card-container').appendChild(cardEl);
        
        updateCardCounter(columnEl);
        saveState();
    }

    function colorAllCardsInColumn(columnEl) {
        columnEl.querySelectorAll('.kanban-card').forEach(card => {
            card.style.backgroundColor = generateRandomColor();
        });
        saveState();
    }

    function sortCardsInColumn(columnEl) {
        const container = columnEl.querySelector('.card-container');
        const cards = Array.from(container.querySelectorAll('.kanban-card'));

        cards.sort((a, b) => {
            const textA = a.querySelector('.card-text').textContent.toLowerCase();
            const textB = b.querySelector('.card-text').textContent.toLowerCase();
            return textA.localeCompare(textB, 'pl');
        });

        cards.forEach(card => container.appendChild(card));
        saveState();
    }

    board.addEventListener('click', (e) => {
        const target = e.target;
        const column = target.closest('.kanban-column');

        if (!column) return;

        if (target.classList.contains('add-card-btn')) {
            addNewCardToColumn(column);
        }
        else if (target.classList.contains('color-column-btn')) {
            colorAllCardsInColumn(column);
        }
        else if (target.classList.contains('sort-column-btn')) {
            sortCardsInColumn(column);
        }
    });

    loadState();
});