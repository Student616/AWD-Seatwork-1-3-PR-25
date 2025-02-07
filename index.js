document.addEventListener("DOMContentLoaded", function () {
    const seatsContainer = document.getElementById("seats-container");
    const reservedSeatsDiv = document.getElementById("reserved-seats");
    const paymentInput = document.getElementById("amount");
    const movieSelect = document.getElementById("movie");

    // Set the maximum number of available seats
    const maxSeats = 10;
    let seats = Array.from({ length: maxSeats }, (_, i) => i + 1); // 10 available seats
    let reservedSeats = JSON.parse(localStorage.getItem("reservedSeats")) || [];

    function renderSeats() {
        seatsContainer.innerHTML = "";
        seats.forEach(seatNum => {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.textContent = seatNum;

            // If the seat is reserved, mark it as such
            if (reservedSeats.includes(seatNum)) {
                seat.classList.add("reserved");
                seat.style.pointerEvents = "none"; // Disable click on reserved seats
            } else {
                seat.addEventListener("click", () => toggleSeatSelection(seatNum, seat));
            }

            seatsContainer.appendChild(seat);
        });
    }

    function toggleSeatSelection(seatNum, seat) {
        if (seat.classList.contains("selected")) {
            seat.classList.remove("selected");
        } else if (reservedSeats.length < maxSeats) { // Prevent selecting more than available seats
            seat.classList.add("selected");
        }
    }

    function calculateTotalPrice() {
        const selectedSeats = document.querySelectorAll(".seat.selected");
        let price = movieSelect.value === "Mission Impossible" ? 380 : 350;
        return selectedSeats.length * price;
    }

    function reserveSeats() {
        const selectedSeats = document.querySelectorAll(".seat.selected");
        let totalCost = calculateTotalPrice();

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        if (parseFloat(paymentInput.value) < totalCost || paymentInput.value <= 0) {
            alert(`Insufficient payment. You need ₱${totalCost}.`);
            return;
        }

        let confirmation = confirm(`Total cost is ₱${totalCost}. Proceed with reservation?`);
        if (!confirmation) return;

        selectedSeats.forEach(seat => {
            let seatNum = parseInt(seat.textContent);
            reservedSeats.push(seatNum);
            seat.classList.remove("selected");
            seat.classList.add("reserved");
        });

        // Save the reserved seats in localStorage
        localStorage.setItem("reservedSeats", JSON.stringify(reservedSeats));

        displayReservedSeats();
        alert("Seats reserved successfully!");
    }

    function displayReservedSeats() {
        reservedSeats.sort((a, b) => a - b);
        reservedSeatsDiv.innerHTML = "Reserved Seats: " + (reservedSeats.length ? reservedSeats.join(", ") : "None");
    }

    function resetReservations() {
        if (confirm("Are you sure you want to clear all reservations?")) {
            localStorage.removeItem("reservedSeats");
            reservedSeats = [];
            renderSeats();
            displayReservedSeats();
        }
    }

    // Event listeners for buttons
    document.querySelector(".reserve-btn").addEventListener("click", reserveSeats);
    document.querySelector(".reset-btn").addEventListener("click", resetReservations);

    renderSeats();
    displayReservedSeats();
});
