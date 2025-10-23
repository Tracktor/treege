import { MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/shared/components/ui/command";
import { FormDescription, FormError, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type AddressSuggestion = {
  label: string;
  value: string;
};

/**
 * Fetch address suggestions from Nominatim (OpenStreetMap)
 */
const fetchNominatimSuggestions = async (query: string, language?: string): Promise<AddressSuggestion[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&addressdetails=1&limit=5`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Treege Renderer",
          ...(language && { "Accept-Language": language }),
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data.map((item: { display_name: string }) => ({
      label: item.display_name,
      value: item.display_name,
    }));
  } catch (error) {
    console.error("Nominatim fetch error:", error);
    return [];
  }
};

/**
 * Fetch address suggestions from Google Places using the SDK
 */
const fetchGooglePlacesSuggestions = (query: string): Promise<AddressSuggestion[]> => {
  if (!query || query.trim().length < 3) {
    return Promise.resolve([]);
  }

  return new Promise((resolve) => {
    if (!window.google?.maps?.places) {
      console.warn("Google Places SDK not loaded yet");
      resolve([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: query }, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
        console.warn("Google Places API status:", status);
        resolve([]);
        return;
      }

      resolve(
        predictions.map((prediction) => ({
          label: prediction.description,
          value: prediction.description,
        })),
      );
    });
  });
};

const DefaultAddressInput = ({ node }: InputRenderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { formValues, setFieldValue, formErrors, googleApiKey, language } = useTreegeRendererContext();
  const t = useTranslate();
  const fieldId = node.id;
  const value = formValues[fieldId] || "";
  const error = formErrors[fieldId];
  const name = node.data.name || fieldId;

  const handleSelectSuggestion = useCallback(
    (suggestion: AddressSuggestion) => {
      setFieldValue(fieldId, suggestion.value);
      setSearchQuery(suggestion.value);
      setPopoverOpen(false);
    },
    [fieldId, setFieldValue],
  );

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      const results = googleApiKey
        ? await fetchGooglePlacesSuggestions(searchQuery)
        : await fetchNominatimSuggestions(searchQuery, language);

      setSuggestions(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, googleApiKey, language]);

  const handleInputChange = useCallback(
    (newValue: string) => {
      setFieldValue(fieldId, newValue);
      setSearchQuery(newValue);

      if (newValue.length >= 3) {
        setPopoverOpen(true);
      }
    },
    [fieldId, setFieldValue],
  );

  return (
    <>
      {googleApiKey && <script async src={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`} />}
      <FormItem className="mb-4">
        <Label htmlFor={name}>
          {t(node.data.label) || node.data.name}
          {node.data.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setPopoverOpen(true);
              }
            }}
            placeholder={t(node.data.placeholder) || t("renderer.defaultAddressInput.enterAddress")}
            className="pr-10"
            autoComplete="off"
          />
          <MapPin className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-muted-foreground" />
          {popoverOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
              <Command>
                <CommandList>
                  <CommandEmpty>{t("renderer.defaultAddressInput.noAddressesFound")}</CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        key={index}
                        value={suggestion.value}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {suggestion.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
        {error && <FormError>{error}</FormError>}
        {node.data.helperText && !error && <FormDescription>{t(node.data.helperText)}</FormDescription>}
      </FormItem>
    </>
  );
};

export default DefaultAddressInput;
