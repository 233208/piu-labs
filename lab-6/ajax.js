class Ajax {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.headers = options.headers || {};
        this.timeout = options.timeout || 5000;
    }

    async _fetch(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);
        
        const config = {
            ...options,
            headers: { ...this.headers, ...options.headers },
            signal: controller.signal
        };

        try {
            const res = await fetch(this.baseURL + url, config);
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            
            const text = await res.text();
            return text ? JSON.parse(text) : {};
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }

    async get(url, options = {}) {
        return this._fetch(url, { ...options, method: 'GET' });
    }

    async post(url, data, options = {}) {
        return this._fetch(url, { 
            ...options, 
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
    }

    async put(url, data, options = {}) {
        return this._fetch(url, { 
            ...options, 
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
    }

    async delete(url, options = {}) {
        return this._fetch(url, { ...options, method: 'DELETE' });
    }
}

window.Ajax = Ajax;
