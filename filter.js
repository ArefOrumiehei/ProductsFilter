const productsContainer = document.querySelector('.products');
const categoriesContainer = document.querySelector('.categories');
const searchInput = document.querySelector('.search');
const priceRange = document.querySelector('.price-range');
const priceValue = document.querySelector('.price-value');

let data;

// fetch api to get products data
async function fetchApi() {
    const response = await fetch('https://fakestoreapi.com/products');
    const json = await response.json();
    data = json;
    showProducts(data)
    setCategories(data)
    setPrice(data)
}

fetchApi();

const showProducts = (filteredProducts) => {
    productsContainer.innerHTML = filteredProducts
    .map(
        (product) => `
            <div class="product">
                <img src=${product.image} alt="" />
                <span class="name">${product.title}</span>
                <span class="priceText">$${product.price}</span>
            </div>`
    )
    .join('');
};

searchInput.addEventListener('keyup', (e) => {
    const value = e.target.value.toLowerCase();
    if (value) {
        showProducts(data.filter((item) => item.title.toLowerCase().includes(value)));
    } else {
        showProducts(data);
    }
});

const setCategories = (data) => {
    const allCats = data.map((item) => item.category);
    const categories = ["All", ...allCats.filter((item, i) => {
        return allCats.indexOf(item) === i;
        }),
    ];

    categoriesContainer.innerHTML = categories.map((cat) =>
        `<span class="category">${cat}</span>`
    ).join("");

    categoriesContainer.addEventListener('click' , (e) => {
        const selectedCategory = e.target.textContent

        selectedCategory === 'All' ? showProducts(data) : showProducts(data.filter(item => item.category === selectedCategory)) 
    })
};


const setPrice = () => {
    const priceList = data.map(item => item.price)
    let maximumPrice = Math.max(...priceList)
    let minimumPrice = Math.min(...priceList)

    priceRange.max = Math.ceil(maximumPrice)
    priceRange.min = Math.ceil(minimumPrice)
    priceRange.value = Math.ceil(maximumPrice)
    priceValue.textContent = `$${Math.ceil(maximumPrice)}`

    priceRange.addEventListener('input' , (e) => {
        priceValue.textContent = `$${e.target.value}`
        showProducts(data.filter(item => item.price <= e.target.value))
    })
}
