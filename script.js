// Kelas untuk Ruangan
class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = []; // Daftar reservasi untuk ruangan ini
    }

    isAvailable(startTime, duration) {
        // Memeriksa apakah ruangan tersedia pada waktu tertentu
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000); // Durasi dalam milidetik

        // Cek apakah ada reservasi yang tumpang tindih
        for (let reservation of this.reservations) {
            const resStart = new Date(`1970-01-01T${reservation.startTime}:00`);
            const resEnd = new Date(resStart.getTime() + reservation.duration * 60 * 60 * 1000);
            if ((start < resEnd) && (end > resStart)) {
                return false; // Ada konflik
            }
        }

        return true; // Tidak ada konflik
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }
}

// Kelas untuk Reservasi
class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

// Daftar ruangan yang ada
const rooms = [
    new Room(1, 30),
    new Room(2, 25),
    new Room(3, 20),
    new Room(4, 20),
    new Room(5, 25),
    new Room(6, 20),
];

// Daftar untuk menyimpan semua reservasi
const reservations = [];

// Fungsi untuk menampilkan daftar ruangan
function displayRooms() {
    const roomListBody = document.getElementById("room-list-body");
    roomListBody.innerHTML = ''; // Bersihkan daftar ruangan sebelumnya

    rooms.forEach(room => {
        const row = document.createElement("tr");
        const status = room.reservations.length === 0 ? "Tersedia" : "Tidak Tersedia";
        row.innerHTML = `
            <td>${room.number}</td>
            <td>${room.capacity}</td>
            <td>${status}</td>
        `;
        roomListBody.appendChild(row);
    });
}

// Fungsi untuk menampilkan daftar reservasi
function displayReservations() {
    const reservationListBody = document.getElementById("reservation-list-body");
    reservationListBody.innerHTML = ''; // Bersihkan daftar reservasi sebelumnya

    reservations.forEach(reservation => {
        const li = document.createElement("li");
        li.innerHTML = `${reservation.name} memesan ruangan ${reservation.roomNumber} pada ${reservation.date} pukul ${reservation.startTime} selama ${reservation.duration} jam. 
        <button onclick="cancelReservation('${reservation.name}', ${reservation.roomNumber}, '${reservation.date}', '${reservation.startTime}')">Batal</button>`;
        reservationListBody.appendChild(li);
    });
}

// Fungsi untuk menangani form pemesanan
document.getElementById("reserve-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const roomNumber = parseInt(document.getElementById("room-number").value);
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const duration = parseInt(document.getElementById("duration").value);

    const room = rooms.find(r => r.number === roomNumber);
    if (!room) {
        alert("Ruangan tidak ditemukan!");
        return;
    }

    if (!room.isAvailable(startTime, duration)) {
        document.getElementById("error-message").textContent = "Ruangan sudah dipesan pada waktu tersebut!";
        return;
    }

    const reservation = new Reservation(name, roomNumber, date, startTime, duration);
    room.addReservation(reservation);
    reservations.push(reservation);

    document.getElementById("error-message").textContent = ''; // Reset pesan kesalahan
    displayRooms();
    displayReservations();
});

// Fungsi untuk membatalkan reservasi
function cancelReservation(name, roomNumber, date, startTime) {
    const room = rooms.find(r => r.number === roomNumber);
    if (!room) return;

    room.reservations = room.reservations.filter(reservation =>
        !(reservation.name === name && reservation.roomNumber === roomNumber && reservation.date === date && reservation.startTime === startTime)
    );

    reservations.splice(reservations.findIndex(r => r.name === name && r.roomNumber === roomNumber && r.date === date && r.startTime === startTime), 1);

    displayRooms();
    displayReservations();
}

// Menampilkan daftar ruangan dan reservasi saat pertama kali
displayRooms();
displayReservations();

function filterRooms() {
    const filterDate = document.getElementById('filter-date').value;
    const availableRooms = rooms.filter(room => {
        return room.reservations.every(reservation => reservation.date !== filterDate);
    });

    const roomListBody = document.getElementById("room-list-body");
    roomListBody.innerHTML = ''; // Clear the list

    availableRooms.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${room.number}</td>
            <td>${room.capacity}</td>
            <td>Tersedia</td>
        `;
        roomListBody.appendChild(row);
    });
}
function cancelReservation(name, roomNumber, date, startTime) {
    const confirmCancel = confirm("Apakah Anda yakin ingin membatalkan reservasi ini?");
    if (!confirmCancel) return;

    const room = rooms.find(r => r.number === roomNumber);
    if (!room) return;

    room.reservations = room.reservations.filter(reservation =>
        !(reservation.name === name && reservation.roomNumber === roomNumber && reservation.date === date && reservation.startTime === startTime)
    );

    reservations.splice(reservations.findIndex(r => r.name === name && r.roomNumber === roomNumber && r.date === date && r.startTime === startTime), 1);

    displayRooms();
    displayReservations();
}
function showNotification(message, isSuccess) {
    const notification = document.createElement("div");
    notification.className = isSuccess ? "success-notification" : "error-notification";
    notification.innerText = message;

    document.body.appendChild(notification);

    // Hapus notifikasi setelah beberapa detik
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Misalnya, ketika pemesanan berhasil
showNotification("Reservasi berhasil!", true);
