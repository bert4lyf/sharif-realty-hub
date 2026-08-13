export function formatPrice(value: number, isRental = false) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
  return isRental ? `${formatted}/mo` : formatted;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export const STATUS_LABELS: Record<string, string> = {
  for_sale: "For Sale",
  pending: "Pending",
  sold: "Sold",
  for_rent: "For Rent",
  rented: "Rented",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  in_contract: "In Contract",
  closed: "Closed",
};

export const LISTING_TYPE_LABELS: Record<string, string> = {
  buy: "Buy",
  rent: "Rent",
  commercial: "Commercial",
};

export function isRentalType(listingType: string) {
  return listingType === "rent" || listingType === "commercial";
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
