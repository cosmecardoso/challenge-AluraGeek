document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'http://localhost:3000/products';

    const productList = document.querySelector('.product-list');
    const noProductsMessage = document.querySelector('.no-products');
    const productForm = document.getElementById('product-form');

    // Função para buscar produtos do servidor
    const fetchProducts = async () => {
        try {
            const response = await fetch(apiURL);
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    // Função para renderizar produtos
    const renderProducts = (products) => {
        productList.innerHTML = '';
        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
        } else {
            noProductsMessage.style.display = 'none';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="Imagem do Produto">
                    <div class="card-container--info">
                        <p>${product.name}</p>
                        <div class="card-container--value">
                            <p>Preço: $${product.price}</p>
                            <img src="path/to/delete-icon.png" alt="Ícone de exclusão" data-id="${product.id}">
                        </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });
        }
    };

    // Função para adicionar novo produto
    const addProduct = async (product) => {
        try {
            await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            fetchProducts();
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    };

    // Captura evento de submissão do formulário
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const image = document.getElementById('product-image').value;

        const newProduct = {
            name,
            price,
            image
        };

        addProduct(newProduct);
        productForm.reset();
    });

    // Função para excluir produto
    productList.addEventListener('click', async (e) => {
        if (e.target.tagName === 'IMG' && e.target.dataset.id) {
            const productId = e.target.dataset.id;
            try {
                await fetch(`${apiURL}/${productId}`, {
                    method: 'DELETE'
                });
                fetchProducts();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        }
    });

    // Busca inicial de produtos
    fetchProducts();
});
