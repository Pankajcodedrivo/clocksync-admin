import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const libraries: "places"[] = ["places"];

interface GoogleAutoCompleteProps {
  onChange: (
    fullAddress: string | null,
    state: string | null,
    lat: number | null,
    lng: number | null
  ) => void;
  currentState?: string | null;
}

const GoogleAutoComplete = ({
  onChange,
  currentState,
}: GoogleAutoCompleteProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });
  // Manage the input value manually with state
  const [inputValue, setInputValue] = useState<string>(currentState || "");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update the input value
  };
  useEffect(() => {
    setInputValue(currentState || "");
  }, [currentState]);
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.address_components) {
        // Extract the state and coordinates
        const fullAddress = place.formatted_address || "";
        const city =
          place.address_components.find((component: any) =>
            component.types.includes("locality")
          )?.long_name ||
          place.address_components.find((component: any) =>
            component.types.includes("neighborhood")
          )?.long_name ||
          place.address_components.find((component: any) =>
            component.types.includes("sublocality")
          )?.long_name ||
          null;

        const state =
          place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || null;

        const locationName = city || state;
        const lat = place.geometry.location?.lat() || null;
        const lng = place.geometry.location?.lng() || null;
        // Update the parent with the state, lat, and lng
        onChange(fullAddress, locationName, lat, lng);
        // Set the input value to the formatted address
        setInputValue(fullAddress);
      }
    }
  };

  return isLoaded ? (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
      options={{
        componentRestrictions: { country: ["us", "ca", "in"] },
        types: ["(regions)"],
      }}
    >
      <input
        id='autocomplete'
        className='form-control'
        type='text'
        value={inputValue}
        onChange={handleInputChange} // Update state on input change
        placeholder='Enter your location'
      />
    </Autocomplete>
  ) : (
    <></>
  );
};

export default GoogleAutoComplete;
