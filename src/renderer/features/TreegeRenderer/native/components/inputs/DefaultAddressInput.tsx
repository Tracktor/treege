import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTreegeRendererContext } from "@/renderer/context/TreegeRendererContext";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";

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
 * Fetch address suggestions from Google Places API (REST)
 */
const fetchGooglePlacesSuggestions = async (query: string, apiKey: string): Promise<AddressSuggestion[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}`,
    );

    if (!response.ok) {
      console.warn("Google Places API request failed:", response.status);
      return [];
    }

    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.warn("Google Places API status:", data.status);
      return [];
    }

    return (data.predictions || []).map((prediction: { description: string }) => ({
      label: prediction.description,
      value: prediction.description,
    }));
  } catch (error) {
    console.error("Google Places fetch error:", error);
    return [];
  }
};

const DefaultAddressInput = ({
  node,
  value,
  setValue,
  error,
  label,
  placeholder,
  helperText,
  id: _id,
  name: _name,
}: InputRenderProps<"address">) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const { language, googleApiKey } = useTreegeRendererContext();
  const t = useTranslate();

  const handleSelectSuggestion = useCallback(
    (suggestion: AddressSuggestion) => {
      setValue(suggestion.value);
      setShowSuggestions(false);
      setSuggestions([]); // Clear suggestions to prevent reopening
    },
    [setValue],
  );

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      const results = googleApiKey
        ? await fetchGooglePlacesSuggestions(searchQuery, googleApiKey)
        : await fetchNominatimSuggestions(searchQuery, language);

      setSuggestions(results);
      setShowSuggestions(true);
      setLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [searchQuery, language, googleApiKey]);

  const handleInputChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setSearchQuery(newValue);
    },
    [setValue],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value || ""}
          onChangeText={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder || t("renderer.defaultAddressInput.enterAddress")}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📍</Text>
        </View>
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : suggestions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("renderer.defaultAddressInput.noAddressesFound")}</Text>
            </View>
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(_, index) => index.toString()}
              style={styles.suggestionsList}
              contentContainerStyle={styles.suggestionsListContent}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)} activeOpacity={0.7}>
                  <Text style={styles.suggestionIcon}>📍</Text>
                  <Text style={styles.suggestionText} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  error: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  icon: {
    fontSize: 16,
  },
  iconContainer: {
    paddingRight: 12,
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    color: "#374151",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingRight: 40,
    paddingVertical: 10,
  },
  inputContainer: {
    position: "relative",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
    marginLeft: 8,
  },
  required: {
    color: "#EF4444",
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  suggestionItem: {
    alignItems: "center",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  suggestionsContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    elevation: 3,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 250,
  },
  suggestionsListContent: {
    flexGrow: 0,
  },
  suggestionText: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
  },
});

export default DefaultAddressInput;
