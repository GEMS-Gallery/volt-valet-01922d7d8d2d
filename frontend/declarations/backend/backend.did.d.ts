import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ChargingStation {
  'id' : bigint,
  'name' : string,
  'totalSlots' : bigint,
  'availableSlots' : bigint,
  'location' : string,
}
export interface Reservation {
  'startTime' : Time,
  'endTime' : Time,
  'userId' : string,
  'stationId' : bigint,
}
export type Time = bigint;
export interface _SERVICE {
  'addChargingStation' : ActorMethod<[string, string, bigint], bigint>,
  'getAllStations' : ActorMethod<[], Array<ChargingStation>>,
  'getReservations' : ActorMethod<[bigint], Array<Reservation>>,
  'getStation' : ActorMethod<[bigint], [] | [ChargingStation]>,
  'makeReservation' : ActorMethod<[bigint, string, Time, Time], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
