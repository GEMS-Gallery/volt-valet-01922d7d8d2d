import Bool "mo:base/Bool";
import Char "mo:base/Char";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor ChargeMyCar {
    // Define the ChargingStation type
    type ChargingStation = {
        id: Nat;
        name: Text;
        location: Text;
        availableSlots: Nat;
        totalSlots: Nat;
    };

    // Define the Reservation type
    type Reservation = {
        stationId: Nat;
        userId: Text;
        startTime: Time.Time;
        endTime: Time.Time;
    };

    stable var nextStationId: Nat = 0;
    let stations = HashMap.HashMap<Nat, ChargingStation>(0, Nat.equal, Nat.hash);
    let reservations = HashMap.HashMap<Nat, [Reservation]>(0, Nat.equal, Nat.hash);

    // Add a new charging station
    public func addChargingStation(name: Text, location: Text, totalSlots: Nat) : async Nat {
        let id = nextStationId;
        nextStationId += 1;

        let newStation: ChargingStation = {
            id;
            name;
            location;
            availableSlots = totalSlots;
            totalSlots;
        };

        stations.put(id, newStation);
        reservations.put(id, []);
        id
    };

    // Get all charging stations
    public query func getAllStations() : async [ChargingStation] {
        Iter.toArray(stations.vals())
    };

    // Get a specific charging station
    public query func getStation(id: Nat) : async ?ChargingStation {
        stations.get(id)
    };

    // Make a reservation
    public func makeReservation(stationId: Nat, userId: Text, startTime: Time.Time, endTime: Time.Time) : async Bool {
        switch (stations.get(stationId)) {
            case (null) { false };
            case (?station) {
                if (station.availableSlots == 0) {
                    false
                } else {
                    let newReservation: Reservation = {
                        stationId;
                        userId;
                        startTime;
                        endTime;
                    };

                    let stationReservations = Option.get(reservations.get(stationId), []);
                    reservations.put(stationId, Array.append(stationReservations, [newReservation]));

                    let updatedStation: ChargingStation = {
                        id = station.id;
                        name = station.name;
                        location = station.location;
                        availableSlots = station.availableSlots - 1;
                        totalSlots = station.totalSlots;
                    };
                    stations.put(stationId, updatedStation);

                    true
                }
            };
        }
    };

    // Get reservations for a station
    public query func getReservations(stationId: Nat) : async [Reservation] {
        Option.get(reservations.get(stationId), [])
    };
}
