export const idlFactory = ({ IDL }) => {
  const ChargingStation = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'totalSlots' : IDL.Nat,
    'availableSlots' : IDL.Nat,
    'location' : IDL.Text,
  });
  const Time = IDL.Int;
  const Reservation = IDL.Record({
    'startTime' : Time,
    'endTime' : Time,
    'userId' : IDL.Text,
    'stationId' : IDL.Nat,
  });
  return IDL.Service({
    'addChargingStation' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat],
        [IDL.Nat],
        [],
      ),
    'getAllStations' : IDL.Func([], [IDL.Vec(ChargingStation)], ['query']),
    'getReservations' : IDL.Func([IDL.Nat], [IDL.Vec(Reservation)], ['query']),
    'getStation' : IDL.Func([IDL.Nat], [IDL.Opt(ChargingStation)], ['query']),
    'makeReservation' : IDL.Func(
        [IDL.Nat, IDL.Text, Time, Time],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
