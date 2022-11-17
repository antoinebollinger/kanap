const params = Object.fromEntries(new URLSearchParams(window.location.search));

document.getElementById("orderId").innerHTML = params.orderId;