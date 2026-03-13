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

// Atualiza o contador flutuante do carrinho (sincronizado com o updateCart)
function updateFloatingCartCount() {
    const floatingCount = document.getElementById('floatingCartCount');
    if (floatingCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        floatingCount.textContent = totalItems;
        floatingCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Chame a função toda vez que atualizar o carrinho
// Adicione esta linha no final da função updateCart():
updateFloatingCartCount();

// E também no inicializador:
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    updateFloatingCartCount();
});
// Inicializa o fundo de partículas 3D
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 60,          // quantidade de partículas (menos = mais leve)
            "density": { "enable": true, "value_area": 800 }
        },
        "color": {
            "value": ["#ffb6c1", "#ff69b4", "#ffd1dc", "#ffffff", "#f8b8d0"]  // tons rosa pastel + branco
        },
        "shape": {
            "type": "circle",     // círculo (como bolhas de sabão)
            "stroke": { "width": 0 }
        },
        "opacity": {
            "value": 0.6,
            "random": true,
            "anim": { "enable": true, "speed": 1, "opacity_min": 0.3 }
        },
        "size": {
            "value": 5,
            "random": true,
            "anim": { "enable": true, "speed": 2, "size_min": 2 }
        },
        "line_linked": {
            "enable": false       // sem linhas conectando (mais clean)
        },
        "move": {
            "enable": true,
            "speed": 1.5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": { "enable": false }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "bubble" },  // bolhas crescem ao passar o mouse
            "onclick": { "enable": false },
            "resize": true
        },
        "modes": {
            "bubble": { "distance": 200, "size": 8, "duration": 2, "opacity": 0.8, "speed": 3 }
        }
    },
    "retina_detect": true
});
});
