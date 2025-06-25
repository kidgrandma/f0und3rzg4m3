// Shared cart management across all stages
const Cart = {
    // Get current cart
    getCart() {
        const cart = localStorage.getItem('adoptionCart');
        return cart ? JSON.parse(cart) : { founders: [], weapons: [], total: 0 };
    },
    
    // Save cart
    saveCart(cart) {
        localStorage.setItem('adoptionCart', JSON.stringify(cart));
    },
    
    // Add founder to cart
    addFounder(founder) {
        const cart = this.getCart();
        
        // Check if already in cart
        if (cart.founders.some(f => f.id === founder.id)) {
            return;
        }
        
        cart.founders.push({
            id: founder.id,
            name: founder.name,
            price: founder.price,
            company: founder.company,
            twins: founder.twins || false
        });
        
        this.updateTotal(cart);
        this.saveCart(cart);
    },
    
    // Add weapon to cart
    addWeapon(weapon) {
        const cart = this.getCart();
        cart.weapons.push({
            id: weapon.id,
            name: weapon.name,
            price: weapon.price
        });
        
        this.updateTotal(cart);
        this.saveCart(cart);
    },
    
    // Remove item from cart
    removeItem(type, id) {
        const cart = this.getCart();
        
        if (type === 'founder') {
            cart.founders = cart.founders.filter(f => f.id !== id);
        } else if (type === 'weapon') {
            cart.weapons = cart.weapons.filter(w => w.id !== id);
        }
        
        this.updateTotal(cart);
        this.saveCart(cart);
    },
    
    // Update total
    updateTotal(cart) {
        const founderTotal = cart.founders.reduce((sum, f) => sum + f.price, 0);
        const weaponTotal = cart.weapons.reduce((sum, w) => sum + w.price, 0);
        cart.total = founderTotal + weaponTotal;
    },
    
    // Clear cart
    clearCart() {
        localStorage.removeItem('adoptionCart');
    },
    
    // Get cart count
    getCartCount() {
        const cart = this.getCart();
        return cart.founders.length + cart.weapons.length;
    }
};