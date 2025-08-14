class ShoppingListApp {
    constructor() {
        this.items = [];
        this.baseUrl = '/api/items';
    }

    init() {
        this.bindEvents();
        this.loadItems();
    }

    bindEvents() {
        const addButton = document.getElementById('addItemBtn');
        const input = document.getElementById('newItemInput');

        addButton.addEventListener('click', () => this.addItem());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });

        // Auto-focus on input
        input.focus();
    }

    async loadItems() {
        this.showLoading(true);
        
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) throw new Error('Failed to load items');
            
            this.items = await response.json();
            this.renderItems();
        } catch (error) {
            console.error('Error loading items:', error);
            this.showAlert('Failed to load shopping list. Please refresh the page.', 'danger');
        } finally {
            this.showLoading(false);
        }
    }

    async addItem() {
        const input = document.getElementById('newItemInput');
        const itemName = input.value.trim();

        if (!itemName) {
            this.showAlert('Please enter an item name!', 'warning');
            input.focus();
            return;
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: itemName })
            });

            if (!response.ok) throw new Error('Failed to add item');

            const newItem = await response.json();
            this.items.push(newItem);
            this.renderItems();
            
            input.value = '';
            input.focus();
            
            this.showAlert(`"${itemName}" added to your list!`, 'success');
        } catch (error) {
            console.error('Error adding item:', error);
            this.showAlert('Failed to add item. Please try again.', 'danger');
        }
    }

    async removeItem(id, name) {
        if (!confirm(`Remove "${name}" from your shopping list?`)) {
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to remove item');

            this.items = this.items.filter(item => item.id !== id);
            this.renderItems();
            
            this.showAlert(`"${name}" removed from your list!`, 'info');
        } catch (error) {
            console.error('Error removing item:', error);
            this.showAlert('Failed to remove item. Please try again.', 'danger');
        }
    }

    async toggleItem(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/toggle`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Failed to toggle item');

            const item = this.items.find(item => item.id === id);
            if (item) {
                item.isCompleted = !item.isCompleted;
                this.renderItems();
            }
        } catch (error) {
            console.error('Error toggling item:', error);
            this.showAlert('Failed to update item. Please try again.', 'danger');
        }
    }

    renderItems() {
        const container = document.getElementById('shoppingList');
        const emptyState = document.getElementById('emptyState');

        if (this.items.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        // Sort items: incomplete first, then completed, both by creation time
        const sortedItems = [...this.items].sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        container.innerHTML = sortedItems.map(item => this.createItemHtml(item)).join('');
    }

    createItemHtml(item) {
        const createdDate = new Date(item.createdAt).toLocaleDateString();
        const completedClass = item.isCompleted ? 'completed' : '';
        
        return `
            <div class="shopping-item ${completedClass} fade-in">
                <div class="item-content">
                    <div class="item-left">
                        <input type="checkbox" class="item-checkbox form-check-input" 
                               ${item.isCompleted ? 'checked' : ''} 
                               onchange="shoppingListApp.toggleItem(${item.id})">
                        <div>
                            <p class="item-name">${this.escapeHtml(item.name)}</p>
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>Added on ${createdDate}
                            </small>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-outline-danger btn-sm" 
                                onclick="shoppingListApp.removeItem(${item.id}, '${this.escapeHtml(item.name)}')"
                                title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = show ? 'block' : 'none';
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        `;

        const container = document.querySelector('.container');
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = alertHtml;
        
        container.insertBefore(alertDiv.firstElementChild, container.firstElementChild);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make it globally available
window.ShoppingListApp = ShoppingListApp;
let shoppingListApp;
