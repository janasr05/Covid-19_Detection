// 1. LocalStorage Data

let users = JSON.parse(localStorage.getItem("users")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let selectedProduct = null;


// 2. Products Array

let products = [
    { id: 1, title: "T Shirt", price: 500, category: "Clothing" },
    { id: 2, title: "Cake", price: 300, category: "Food" },
    { id: 3, title: "Shoes", price: 1000, category: "Accessories" },
    { id: 4, title: "Watch", price: 800, category: "Accessories" },
    { id: 5, title: "Bag", price: 600, category: "Accessories" },
    { id: 6, title: "Hoodie", price: 900, category: "Clothing" }
];


// 3. Page Switch

function showPage(page) {

    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.add("hidden");

    if (page === "register") {
        document.getElementById("registerPage").classList.remove("hidden");
    }

    if (page === "login") {
        document.getElementById("loginPage").classList.remove("hidden");
    }

    if (page === "app") {
        document.getElementById("app").classList.remove("hidden");
    }

}


// 4. Register

document.getElementById("registerForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim().toLowerCase();
    let password = document.getElementById("regPassword").value;
    let confirm = document.getElementById("confirmPassword").value;

    // Clear old errors

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmError").textContent = "";

    let isValid = true;

    // Name validation

    if (name === "") {

        document.getElementById("nameError").textContent = "Enter your name";
        isValid = false;

    }

    // Email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        document.getElementById("emailError").textContent = "Enter a valid email";
        isValid = false;

    }

    // Password validation

    if (password.length < 8) {

        document.getElementById("passwordError").textContent = "Password minimum 8 characters";
        isValid = false;

    }

    // Confirm password validation

    if (password !== confirm) {

        document.getElementById("confirmError").textContent = "Password does not match";
        isValid = false;

    }

    // Email already registered

    let result = users.find(function(user) {
        return user.email === email;
    });

    if (result) {

        document.getElementById("emailError").textContent = "Email already registered";
        isValid = false;

    }

    // Final condition

    if (isValid) {

        let user = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };

        users.push(user);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Register Successful");

        document.getElementById("registerForm").reset();

        showPage("login");

    }

});


// 5. Login

document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let email = document.getElementById("loginEmail").value.trim().toLowerCase();
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginPasswordError").textContent = "";

    let result = users.find(function(user) {
        return user.email === email && user.password === password;
    });

    if (result) {

        currentUser = result;

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Save login history

        let history = {
            name: result.name,
            email: result.email,
            date: new Date().toLocaleString()
        };

        loginHistory.push(history);

        localStorage.setItem("loginHistory", JSON.stringify(loginHistory));

        document.getElementById("loginForm").reset();

        openMainPage();

    } else {

        document.getElementById("loginPasswordError").textContent = "Invalid Email or Password";

    }

});


// 6. Main Page

function openMainPage() {

    document.getElementById("userName").textContent = currentUser.name;

    showPage("app");

    showProducts();

}

function showProducts() {

    document.getElementById("tableView").classList.add("hidden");
    document.getElementById("shopView").classList.remove("hidden");

    display(products);

}


// 7. Product Display

function display(data) {

    document.getElementById("productList").innerHTML = "";

    if (data.length === 0) {

        document.getElementById("productList").innerHTML = "<p>No products found</p>";

    }

    data.forEach(function(item) {

        document.getElementById("productList").innerHTML += `
            <div class="product">
                <div class="product-info">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                    <p class="price">₹${item.price}</p>
                    <button onclick="openOrder(${item.id})">Order Now</button>
                </div>
            </div>
        `;

    });

}


// 8. Search

document.getElementById("searchInput").addEventListener("input", function() {

    let value = this.value.toLowerCase();

    let result = products.filter(function(item) {

        return item.title.toLowerCase().includes(value);

    });

    display(result);

});


// 9. Advanced Search

document.getElementById("applyFilter").addEventListener("click", function() {

    let min = document.getElementById("minPrice").value;
    let max = document.getElementById("maxPrice").value;
    let category = document.getElementById("categoryFilter").value;

    let result = products.filter(function(item) {

        let minCheck = min === "" || item.price >= Number(min);
        let maxCheck = max === "" || item.price <= Number(max);
        let categoryCheck = category === "" || item.category === category;

        return minCheck && maxCheck && categoryCheck;

    });

    display(result);

});

// Show / Hide advanced panel

document.getElementById("advancedBtn").addEventListener("click", function() {

    document.getElementById("advancedPanel").classList.toggle("hidden");

});


// 10. Sort

document.getElementById("sortSelect").addEventListener("change", function() {

    let value = this.value;

    let result = [...products];

    if (value === "az") {

        result.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });

    } else if (value === "za") {

        result.sort(function(a, b) {
            return b.title.localeCompare(a.title);
        });

    } else if (value === "low") {

        result.sort(function(a, b) {
            return a.price - b.price;
        });

    } else if (value === "high") {

        result.sort(function(a, b) {
            return b.price - a.price;
        });

    }

    display(result);

});


// 11. Reset Search

document.getElementById("clearFilter").addEventListener("click", function() {

    document.getElementById("searchInput").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("sortSelect").value = "";

    display(products);

});


// 12. Order Popup

function openOrder(id) {

    selectedProduct = products.find(function(item) {
        return item.id === id;
    });

    document.getElementById("selectedProduct").textContent =
        selectedProduct.title + " - ₹" + selectedProduct.price;

    document.getElementById("customerName").value = currentUser.name;
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";
    document.getElementById("quantity").value = 1;
    document.getElementById("orderError").textContent = "";

    document.getElementById("orderFormArea").classList.remove("hidden");
    document.getElementById("orderSuccess").classList.add("hidden");

    document.getElementById("orderModal").classList.remove("hidden");

}

document.getElementById("closeModal").addEventListener("click", function() {

    document.getElementById("orderModal").classList.add("hidden");

});

document.getElementById("doneBtn").addEventListener("click", function() {

    document.getElementById("orderModal").classList.add("hidden");

});


// 13. Confirm Order

document.getElementById("orderForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("customerName").value.trim();
    let phone = document.getElementById("customerPhone").value.trim();
    let address = document.getElementById("customerAddress").value.trim();
    let quantity = Number(document.getElementById("quantity").value);

    const phoneRegex = /^[6-9]\d{9}$/;

    if (name === "" || !phoneRegex.test(phone) || address === "" || quantity < 1) {

        document.getElementById("orderError").textContent =
            "Enter valid name, 10 digit phone, address and quantity";

    } else {

        let order = {
            orderId: Date.now(),
            name: name,
            phone: phone,
            address: address,
            email: currentUser.email,
            product: selectedProduct.title,
            price: selectedProduct.price,
            quantity: quantity,
            total: selectedProduct.price * quantity,
            date: new Date().toLocaleString(),
            status: "Confirmed"
        };

        orders.push(order);

        localStorage.setItem("orders", JSON.stringify(orders));

        document.getElementById("orderFormArea").classList.add("hidden");
        document.getElementById("orderSuccess").classList.remove("hidden");

    }

});


// 14. Table Display

function showTable(title, headings, rows) {

    document.getElementById("shopView").classList.add("hidden");
    document.getElementById("tableView").classList.remove("hidden");

    document.getElementById("tableTitle").textContent = title;

    let table = "<table><thead><tr>";

    headings.forEach(function(heading) {

        table += "<th>" + heading + "</th>";

    });

    table += "</tr></thead><tbody>";

    if (rows.length === 0) {

        table += "<tr><td colspan='" + headings.length + "'>No data found</td></tr>";

    }

    rows.forEach(function(row) {

        table += "<tr>";

        row.forEach(function(cell) {

            // stop users typing HTML into the table

            let text = String(cell).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

            table += "<td>" + text + "</td>";

        });

        table += "</tr>";

    });

    table += "</tbody></table>";

    document.getElementById("tableContent").innerHTML = table;

}


// 15. Login History

function showLoginHistory() {

    let result = loginHistory.filter(function(item) {
        return item.email === currentUser.email;
    });

    let rows = result.map(function(item) {
        return [item.name, item.email, item.date];
    });

    showTable("My Login History", ["Name", "Email", "Login Date"], rows);

}


// 16. Purchase History

function showOrderHistory() {

    let result = orders.filter(function(item) {
        return item.email === currentUser.email;
    });

    let rows = result.map(function(item) {
        return [item.orderId, item.product, item.quantity, "₹" + item.total, item.date, item.status];
    });

    showTable("My Purchase History", ["Order ID", "Product", "Qty", "Total", "Date", "Status"], rows);

}


// 17. All Customer Purchases

function showAllOrders() {

    let rows = orders.map(function(item) {
        return [item.name, item.email, item.product, item.quantity, "₹" + item.total, item.phone, item.date, item.status];
    });

    showTable("All Customer Purchases", ["Name", "Email", "Product", "Qty", "Total", "Phone", "Date", "Status"], rows);

}


// 18. Side Menu Buttons

document.querySelectorAll("aside button").forEach(function(button) {

    button.addEventListener("click", function() {

        let view = button.dataset.view;

        if (view === "shop") {
            showProducts();
        }

        if (view === "myOrders") {
            showOrderHistory();
        }

        if (view === "loginHistory") {
            showLoginHistory();
        }

        if (view === "allOrders") {
            showAllOrders();
        }

    });

});


// 19. Login / Register Links and Logout

document.getElementById("goLogin").addEventListener("click", function() {

    showPage("login");

});

document.getElementById("goRegister").addEventListener("click", function() {

    showPage("register");

});

document.getElementById("logoutBtn").addEventListener("click", function() {

    localStorage.removeItem("currentUser");

    currentUser = null;

    showPage("login");

});


// 20. Check Login When Page Opens

if (currentUser === null) {

    if (users.length === 0) {

        showPage("register");

    } else {

        showPage("login");

    }

} else {

    openMainPage();

}
