// Carrinho - Armazenamento persistente no navegador
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualiza o contador, lista de itens e total no modal
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Atualiza o badge do ícone do carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

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
                        <div>
                            <strong>${item.name}</strong><br>
                            <small>R$ ${item.price.toFixed(2)} × ${item.quantity}</small>
                        </div>
                        <div>
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

    // Salva no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Adicionar produto ao carrinho
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Evita comportamentos indesejados em mobile

        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        if (!id || !name || isNaN(price)) {
            console.warn('Dados do produto incompletos:', btn);
            return;
        }

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCart();

        // Feedback visual simples (melhor que alert em mobile)
        btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        btn.classList.add('btn-success');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
            btn.classList.remove('btn-success');
        }, 1500);
    });
});

// Remover item do carrinho
document.addEventListener('click', e => {
    const removeBtn = e.target.closest('.remove-item');
    if (removeBtn) {
        const id = removeBtn.dataset.id;
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
});

// Finalizar compra - Enviar para WhatsApp
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

        message += `\nTotal: R$ ${total.toFixed(2)}\n\n`;
        message += 'Endereço de entrega: [insira aqui]\n';
        message += 'Forma de pagamento: [pix / dinheiro / cartão]\n';
        message += 'Observações: [opcional]';

        const whatsappUrl = `https://wa.me/5567991161810?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Opcional: limpar carrinho após envio
        // if (confirm('Deseja limpar o carrinho após enviar?')) {
        //     cart = [];
        //     updateCart();
        //     bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
        // }
    });
}

// Inicializa o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});