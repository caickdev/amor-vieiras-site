// Carrinho - Armazenamento persistente no navegador
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualiza contador navbar + modal + flutuante
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const floatingCount = document.getElementById('floatingCartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) cartCount.textContent = totalItems;

    if (floatingCount) {
        floatingCount.textContent = totalItems;
        floatingCount.style.display = totalItems > 0 ? 'block' : 'none';
    }

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center text-muted py-4">Seu carrinho está vazio.</p>';
            if (cartTotal) cartTotal.textContent = 'R$ 0,00';
        } else {
            let html = '';
            let total = 0;

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;

                html += `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div style="flex: 1;">
                            <strong>${item.name}</strong><br>
                            <small>R$ ${item.price.toFixed(2)} × ${item.quantity}</small>
                        </div>
                        <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary decrease-cart-qty" data-id="${item.id}" type="button">-</button>
                            <input type="number" class="form-control text-center" value="${item.quantity}" min="1" readonly>
                            <button class="btn btn-outline-secondary increase-cart-qty" data-id="${item.id}" type="button">+</button>
                        </div>
                        <div class="ms-3">
                            <span class="badge bg-primary rounded-pill me-2">R$ ${subtotal.toFixed(2)}</span>
                            <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            cartItems.innerHTML = html;
            if (cartTotal) cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Inicializa tudo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada - inicializando carrinho e modais");

    // Controle de quantidade nos produtos (+ / -)
    document.addEventListener('click', e => {
        const target = e.target;

        if (target.classList.contains('increase-qty') || target.classList.contains('decrease-qty')) {
            const input = target.closest('.input-group')?.querySelector('.qty-input');
            if (!input) return;

            let qty = parseInt(input.value) || 1;

            if (target.classList.contains('increase-qty')) {
                qty = Math.min(qty + 1, 99);
            } else if (target.classList.contains('decrease-qty')) {
                qty = Math.max(qty - 1, 1);
            }

            input.value = qty;
        }

        // Controle de quantidade e remoção no carrinho
        if (target.classList.contains('increase-cart-qty') || target.classList.contains('decrease-cart-qty')) {
            const id = target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (!item) return;

            if (target.classList.contains('increase-cart-qty')) {
                item.quantity += 1;
            } else if (target.classList.contains('decrease-cart-qty')) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else if (confirm('Deseja remover o item?')) {
                    cart = cart.filter(i => i.id !== id);
                }
            }

            updateCart();
        }

        const removeBtn = e.target.closest('.remove-item');
        if (removeBtn) {
            const id = removeBtn.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    });

    // Adicionar ao carrinho
    const addButtons = document.querySelectorAll('.add-to-cart');
    console.log(`Encontrados ${addButtons.length} botões .add-to-cart`);

    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const priceStr = btn.dataset.price;

            const qtyInput = btn.closest('.product-actions')?.querySelector('.qty-input');
            const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

            if (!id || !name || !priceStr || quantity < 1) {
                console.error('Dados inválidos ao adicionar:', { id, name, priceStr, quantity });
                return;
            }

            const price = parseFloat(priceStr);
            if (isNaN(price)) {
                console.error('Preço inválido:', priceStr);
                return;
            }

            console.log('Adicionando ao carrinho:', { id, name, price, quantity });

            let item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += quantity;
            } else {
                cart.push({ id, name, price, quantity });
            }

            updateCart();

            // Feedback visual
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
            btn.classList.add('btn-success');
            setTimeout(() => {
                btn.innerHTML = original;
                btn.classList.remove('btn-success');
            }, 1500);
        });
    });

    // Finalizar no WhatsApp
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            let message = 'Olá Amor Vieiras! Gostaria de fazer o seguinte pedido:\n\n';
            let total = 0;

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                message += `${item.quantity} × ${item.name} → R$ ${subtotal.toFixed(2)}\n`;
                total += subtotal;
            });

            message += `\nTotal: R$ ${total.toFixed(2)}\n\nEndereço de entrega: [insira aqui]\nForma de pagamento: [pix / dinheiro]\nObservações: [opcional]`;

            const url = `https://wa.me/5567991161810?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }

    // Inicializa tudo
    updateCart();

    // Partículas (opcional)
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#ffb6c1", "#ff69b4", "#ffd1dc", "#ffffff", "#f8b8d0"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.3 } },
                "size": { "value": 5, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 2 } },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": false }, "resize": true },
                "modes": { "bubble": { "distance": 200, "size": 8, "duration": 2, "opacity": 0.8, "speed": 3 } }
            },
            "retina_detect": true
        });
    }
});
