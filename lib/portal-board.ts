import type { PortalLoad } from "./portal-contract";

export type CarrierBoardFilters = {
  search: string;
  pickupFrom: string;
  pickupThrough: string;
  origin: string;
  destination: string;
};

export function filterCarrierLoads(loads: PortalLoad[], filters: CarrierBoardFilters): PortalLoad[] {
  const search = filters.search.trim().toLowerCase();
  const origin = filters.origin.trim().toLowerCase();
  const destination = filters.destination.trim().toLowerCase();
  return loads.filter((load) => {
    const from = `${load.origin_city} ${load.origin_state}`.toLowerCase();
    const to = `${load.dest_city} ${load.dest_state}`.toLowerCase();
    return (!filters.pickupFrom || !!load.pickup_date && load.pickup_date >= filters.pickupFrom)
      && (!filters.pickupThrough || !!load.pickup_date && load.pickup_date <= filters.pickupThrough)
      && (!origin || from.includes(origin))
      && (!destination || to.includes(destination))
      && (!search || `${from} ${to} ${load.equipment || ""} ${load.pickup_date || ""}`.toLowerCase().includes(search));
  });
}
