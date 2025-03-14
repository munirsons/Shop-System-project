const Uname = document.querySelector("#username");
const Pin = document.querySelector("#pin");
const LoginBtn = document.querySelector(".login-btn"); // Use class selector for the button
const errorMessage = document.querySelector(".hide");

// Add event listener for the login button click
LoginBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the link from navigating by default

    if (Uname.value === "abcd" && Pin.value === "1234") {
        // Redirect to the welcome page when the credentials are correct
        window.location.href = "/WellcomePg/pg1.html";
    } else {
        // Show error message when the credentials are incorrect
        errorMessage.classList.remove("hide");
    }
});
let logout= document.querySelector(".logout").addEventListener("click", function(event) {
    event.preventDefault(); // لنک کا ڈیفالٹ بیہیویئر روکنا
    localStorage.clear(); // لوکل اسٹوریج کو صاف کرنا (اگر یوزر کا سیشن محفوظ ہے)
    sessionStorage.clear(); // سیشن اسٹوریج کو بھی صاف کرنا
    alert("You have been logged out successfully!"); // یوزر کو اطلاع دینا
    window.location.href = "login.html"; // لاگ آؤٹ کے بعد لاگ ان پیج پر ری ڈائریکٹ کرنا
});

