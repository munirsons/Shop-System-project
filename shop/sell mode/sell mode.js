let products = [];
let selectedProducts = [];

function loadCSV() {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8OSOnwvkrZadGgrIqu1o1sGopoIaI0sAgb4Ez7YXT2HrHj2vEOnY8ctWvA_tnwgtCodWkqtrG02rB/pub?gid=0&single=true&output=csv")
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    products = results.data;
                    displayProducts(products);
                }
            });
        });
}

function displayProducts(data) {
    let container = document.getElementById("productContainer");
    container.innerHTML = "";
    data.forEach((item, index) => {
        let card = `<div class='col-md-3'><div class='card p-3' onclick='addToBill(${index})'>
            <h5>${item.Product_Name}</h5>
            <p>Price: ${item.Sell_Price}</p>
            <p>Discount: ${item.Discount}</p>
        </div></div>`;
        container.innerHTML += card;
    });
}

function addToBill(index) {
    let product = products[index];
    let quantity = prompt(`Enter quantity for ${product.Product_Name}:`, 1);
    if (quantity !== null && !isNaN(quantity) && quantity > 0) {
        let priceAfterDiscount = product.Sell_Price - product.Discount;
        let existing = selectedProducts.find(p => p.name === product.Product_Name);
        if (existing) {
            existing.qty += parseInt(quantity);
        } else {
            selectedProducts.push({
                name: product.Product_Name,
                qty: parseInt(quantity),
                discount: product.Discount,
                price: priceAfterDiscount
            });
        }
    }
}

document.getElementById("viewBillBtn").addEventListener("click", function() {
    let tableBody = document.getElementById("billTableBody");
    tableBody.innerHTML = "";
    let totalBill = 0;
    selectedProducts.forEach((product, index) => {
        let totalPrice = product.qty * product.price;
        totalBill += totalPrice;
        let row = `<tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.qty}</td>
            <td>${product.discount}</td>
            <td>${product.price}</td>
            <td>${totalPrice}</td>
            <td>
                <button class='btn btn-sm btn-warning' onclick='editProduct(${index})'>Edit</button>
                <button class='btn btn-sm btn-danger' onclick='deleteProduct(${index})'>Del</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    document.getElementById("totalBillAmount").innerText = totalBill;
    new bootstrap.Modal(document.getElementById('billModal')).show();
});

document.getElementById("confirmBillBtn").addEventListener("click", function() {
    let billWindow = window.open('', '', 'width=400,height=600');
    billWindow.document.write('<h3>Shop Name</h3>');
    billWindow.document.write('<p>' + new Date().toLocaleString() + '</p>');
    billWindow.document.write('<hr>');
    billWindow.document.write('<table border="1" width="100%">');
    billWindow.document.write('<tr><th>Product</th><th>Qty</th><th>Discount</th><th>Price</th><th>Total</th></tr>');
    selectedProducts.forEach(product => {
        billWindow.document.write(`<tr><td>${product.name}</td><td>${product.qty}</td><td>${product.discount}</td><td>${product.price}</td><td>${product.qty * product.price}</td></tr>`);
    });
    billWindow.document.write('</table>');
    billWindow.document.write('<button onclick="window.print()">Print Bill</button>');
});

document.getElementById("resetBillBtn").addEventListener("click", function() {
    selectedProducts = [];
    alert("Bill Reset Successfully!");
    location.reload();
});

loadCSV();
document.getElementById("confirmBillBtn").addEventListener("click", function() {
let billWindow = window.open('', '', 'width=400,height=600');
billWindow.document.write('<h2 style="text-align:center;">Shop Name</h2>');
billWindow.document.write('<p style="text-align:center;">' + new Date().toLocaleString() + '</p>');
billWindow.document.write('<hr>');
billWindow.document.write('<table border="1" width="100%" style="border-collapse: collapse; text-align: center;">');
billWindow.document.write('<tr><th>Product</th><th>Qty</th><th>Discount</th><th>Price</th><th>Total</th></tr>');

let totalBill = 0;
selectedProducts.forEach(product => {
let totalPrice = product.qty * product.price;
totalBill += totalPrice;
billWindow.document.write(`<tr><td>${product.name}</td><td>${product.qty}</td><td>${product.discount}</td><td>${product.price}</td><td>${totalPrice}</td></tr>`);
});

// **کل رقم کو ایک نمایاں لائن میں شامل کرنا**
billWindow.document.write(`<tr style="font-weight: bold; background-color: #f2f2f2;">
<td colspan="4" style="text-align:right; padding: 8px;">Grand Total:</td>
<td style="padding: 8px;">${totalBill}</td>
</tr>`);

billWindow.document.write('</table>');
billWindow.document.write('<br><h3 style="text-align:center;">Total Bill Amount: <span style="color:red;">' + totalBill + '</span></h3>');
billWindow.document.write('<br><button onclick="window.print()">Print Bill</button>');
});


document.getElementById("searchBox").addEventListener("input", function() {
    let searchQuery = this.value.toLowerCase(); // User input in lowercase
    let filteredProducts = products.filter(product => 
        product.Product_Name.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
});
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    timeElement.dateTime = now.toISOString();
    timeElement.innerHTML = `Today is: ${now.toLocaleDateString(undefined, options)}, 
                                     Time: ${now.toLocaleTimeString()}`;
}