//Elements
const container = document.querySelector(".container")
const filterMenu = document.querySelector('.filter-menu')
const productsContainer = document.querySelector('.products');
const categoriesContainer = document.querySelector('.categories');
const searchInput = document.querySelector('.search');
const priceRange = document.querySelector('.price-range');
const priceValue = document.querySelector('.price-value');
const darkModeToggle = document.querySelector('.darkmode-toggle')

let data;



// Create dark mode theme
darkModeToggle.addEventListener('click' , darkModeHandler)

function darkModeHandler() {
    if (darkModeToggle.checked) {
        container.className = 'container dark'
        filterMenu.className = 'filter-menu dark'
        searchInput.className = 'search dark'
    } else {
        container.className = 'container'
        filterMenu.className = 'filter-menu'
        searchInput.className = 'search'
    }
}


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
        <div class='product'>
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

//Follow dark mode situation 
darkModeToggle.addEventListener('change', () => {
    const products = document.querySelectorAll('.product');

    // If darkModeToggle true
    if (darkModeToggle.checked) {
        // add dark class from all of them
        products.forEach((product) => {
            product.classList.add('dark');
        });
    } else {
        // If darkModeToggle false
        products.forEach((product) => {
            // remove dark class from all of them
            product.classList.remove('dark');
        });
    }
});