const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY!;
const BASE_URL = 'https://places.googleapis.com/v1';

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string | null;
}

// Runtime-only: never persist this data to DB (Google Places license)
export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  radius = 1500,
  query?: string
): Promise<PlaceSearchResult[]> {
  const body = {
    includedTypes: ['restaurant', 'cafe', 'bar'],
    maxResultCount: 20,
    locationRestriction: {
      circle: { center: { latitude: lat, longitude: lng }, radius },
    },
    ...(query && { textQuery: query }),
  };

  const res = await fetch(`${BASE_URL}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.primaryTypeDisplayName',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Places API error: ${res.status}`);

  const data = await res.json();
  return (data.places ?? []).map((p: any) => ({
    place_id: p.id,
    name: p.displayName?.text ?? '',
    address: p.formattedAddress ?? '',
    lat: p.location?.latitude ?? 0,
    lng: p.location?.longitude ?? 0,
    category: p.primaryTypeDisplayName?.text ?? null,
  }));
}
