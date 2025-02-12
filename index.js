document.addEventListener("DOMContentLoaded", function () {
    const seatsContainer = document.getElementById("seats-container");
    const reservedSeatsDiv = document.getElementById("reserved-seats");
    const paymentInput = document.getElementById("payment");
    const movieSelect = document.getElementById("movieSelect");

    // Max seats
    const maxSeats = 10;
    let reservedSeats = JSON.parse(localStorage.getItem("reservedSeats")) || [];

    function renderSeats() {
        seatsContainer.innerHTML = "";
        for (let i = 1; i <= maxSeats; i++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.textContent = i;

            // If seat is reserved, mark it as red and disable click
            if (reservedSeats.includes(i)) {
                seat.classList.add("reserved");
                seat.style.pointerEvents = "none";
            } else {
                seat.addEventListener("click", () => toggleSeatSelection(seat));
            }

            seatsContainer.appendChild(seat);
        }
    }

    function toggleSeatSelection(seat) {
        if (seat.classList.contains("selected")) {
            seat.classList.remove("selected");
        } else {
            seat.classList.add("selected");
        }
    }

    function calculateTotalPrice() {
        const selectedSeats = document.querySelectorAll(".seat.selected").length;
        let price = movieSelect.value === "Mission Impossible" ? 380 : 350;
        return selectedSeats * price;
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

        // Save reserved seats
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

    function resetOnMovieChange() {
        reservedSeats = [];
        localStorage.removeItem("reservedSeats");
        paymentInput.value = "";
        renderSeats();
        displayReservedSeats();
    }

    document.querySelector(".reserve-btn").addEventListener("click", reserveSeats);
    document.querySelector(".reset-btn").addEventListener("click", resetReservations);
    movieSelect.addEventListener("change", resetOnMovieChange);

    renderSeats();
    displayReservedSeats();
});
