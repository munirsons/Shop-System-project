//Here this is the code for dat and time..............
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    timeElement.dateTime = now.toISOString();
    timeElement.innerHTML = `Today is: ${now.toLocaleDateString(undefined, options)}, 
                                     Time: ${now.toLocaleTimeString()}`;
}

setInterval(updateTime, 1000);
updateTime();

let rowCount = 0;

document.getElementById("addRowBtn").addEventListener("click", function () {
    addNewRow();
});

// Enable Enter key to add new row
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewRow();
    }
});

function addNewRow() {
    rowCount++;
    let table = document.getElementById("productTable");
    let row = table.insertRow();
    row.innerHTML = `
                <td>${rowCount}</td>
                <td><input type="text" class="form-control" placeholder="Product Name"></td>
                <td><input type="text" class="form-control" placeholder="Product URL"></td>
                <td><input type="text" class="form-control" placeholder="Shop URL"></td>
                <td><input type="number" class="form-control qty" placeholder="Quantity" min="0" value="0"></td>
                <td><input type="number" class="form-control price" placeholder="Sell Price" min="0" value="0"></td>
                <td><input type="number" class="form-control price" placeholder="Disc." min="0.0" value="0.0"></td>

                <td><input type="text" class="form-control" placeholder="W/T"></td>
                <td>
                    <button class="btn btn-success saveBtn">Save</button>
                    <button class="btn btn-warning editBtn" style="display: none;">Edit</button>
                    <button class="btn btn-danger deleteBtn">Delete</button>
                </td>
            `;
}

document.getElementById("productTable").addEventListener("click", function (e) {
    let row = e.target.parentElement.parentElement;
    let inputs = row.querySelectorAll("input");

    // DELETE button functionality
    if (e.target.classList.contains("deleteBtn")) {
        row.remove();
    }

    // SAVE button functionality (Lock inputs)
    if (e.target.classList.contains("saveBtn")) {
        inputs.forEach(input => input.setAttribute("disabled", "true"));
        e.target.style.display = "none";  // Hide Save button
        row.querySelector(".editBtn").style.display = "inline-block"; // Show Edit button
    }

    // EDIT button functionality (Unlock inputs & focus sequentially)
    if (e.target.classList.contains("editBtn")) {
        inputs.forEach(input => input.removeAttribute("disabled"));

        // Focus on first input (P.Name) and then move to others using Tab
        if (inputs.length > 0) {
            inputs[0].focus();
            inputs.forEach((input, index) => {
                input.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        if (index + 1 < inputs.length) {
                            inputs[index + 1].focus();
                        }
                    }
                });
            });
        }

        e.target.style.display = "none";  // Hide Edit button
        row.querySelector(".saveBtn").style.display = "inline-block"; // Show Save button
    }
});

// Prevent negative numbers in Quantity & Sell Price
document.getElementById("productTable").addEventListener("input", function (e) {
    if (e.target.type === "number") {
        if (parseFloat(e.target.value) < 0) {
            e.target.value = 0;
        }
    }
});

// Download Excel functionality
document.getElementById("downloadExcelBtn").addEventListener("click", function () {
    let table = document.querySelector("table");
    let wb = XLSX.utils.book_new();

    // Extract only the required data from the table (excluding "Actions" column)
    let data = [];
    let headers = [];

    // Get table headers except "Actions"
    document.querySelectorAll("thead th").forEach((th, index) => {
        if (index !== 7) {  // Skip "Actions" column (index 7)
            headers.push(th.innerText);
        }
    });

    data.push(headers); // Add headers to the data array

    // Get table rows except "Actions" column
    document.querySelectorAll("#productTable tr").forEach(row => {
        let rowData = [];
        let cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
            if (index !== 7) { // Skip "Actions" column
                let input = cell.querySelector("input");
                rowData.push(input ? input.value : cell.innerText);
            }
        });

        data.push(rowData);
    });

    // Convert data to worksheet and add to workbook
    let ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Save file
    XLSX.writeFile(wb, "Product_List.xlsx");
});

document.querySelector(".logout").addEventListener("click", function (event) {
    event.preventDefault(); // لنک کا ڈیفالٹ بیہیویئر روکنا
    localStorage.clear(); // لوکل اسٹوریج کو صاف کرنا (اگر یوزر کا سیشن محفوظ ہے)
    sessionStorage.clear(); // سیشن اسٹوریج کو بھی صاف کرنا
    alert("You have been logged out successfully!"); // یوزر کو اطلاع دینا
    window.location.href = "login.html"; // لاگ آؤٹ کے بعد لاگ ان پیج پر ری ڈائریکٹ کرنا
});
