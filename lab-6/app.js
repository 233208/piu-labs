const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 3000
});

const list = document.getElementById('data-list');
const errorMsg = document.getElementById('error-msg');
const loader = document.getElementById('loader');

document.getElementById('btn-load').addEventListener('click', async () => {
    clear();
    showLoader(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const data = await api.get('/posts?_limit=5');
        renderList(data);
    } catch (err) {
        showError(err.message);
    } finally {
        showLoader(false);
    }
});

document.getElementById('btn-error').addEventListener('click', async () => {
    clear();
    showLoader(true);
    try {
        await api.get('/non-existent-page');
    } catch (err) {
        showError(err.message);
    } finally {
        showLoader(false);
    }
});

document.getElementById('btn-reset').addEventListener('click', clear);

function renderList(posts) {
    list.innerHTML = posts.map((post, index) => `
        <div class="item" style="animation-delay: ${index * 100}ms">
            <strong>${post.title}</strong>
            <p>${post.body}</p>
        </div>
    `).join('');
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

function showLoader(show) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}

function clear() {
    list.innerHTML = '';
    errorMsg.classList.add('hidden');
}
