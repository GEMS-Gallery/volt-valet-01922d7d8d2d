import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const addStationForm = document.getElementById('add-station-form');
    const stationList = document.getElementById('stations');
    const reservationForm = document.getElementById('reservation-form');
    const stationSelect = document.getElementById('station-select');

    addStationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('station-name').value;
        const location = document.getElementById('station-location').value;
        const totalSlots = parseInt(document.getElementById('station-slots').value);

        try {
            await backend.addChargingStation(name, location, totalSlots);
            addStationForm.reset();
            await updateStationList();
        } catch (error) {
            console.error('Error adding station:', error);
        }
    });

    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const stationId = parseInt(stationSelect.value);
        const userId = document.getElementById('user-id').value;
        const startTime = new Date(document.getElementById('start-time').value).getTime() * 1000000;
        const endTime = new Date(document.getElementById('end-time').value).getTime() * 1000000;

        try {
            const result = await backend.makeReservation(stationId, userId, startTime, endTime);
            if (result) {
                alert('Reservation made successfully!');
                reservationForm.reset();
                await updateStationList();
            } else {
                alert('Unable to make reservation. The station might be full.');
            }
        } catch (error) {
            console.error('Error making reservation:', error);
        }
    });

    async function updateStationList() {
        try {
            const stations = await backend.getAllStations();
            stationList.innerHTML = '';
            stationSelect.innerHTML = '<option value="">Select a station</option>';

            stations.forEach(station => {
                const li = document.createElement('li');
                li.textContent = `${station.name} - ${station.location} (${station.availableSlots}/${station.totalSlots} slots available)`;
                stationList.appendChild(li);

                const option = document.createElement('option');
                option.value = station.id;
                option.textContent = station.name;
                stationSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error updating station list:', error);
        }
    }

    // Initial update of the station list
    await updateStationList();
});
