import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
      setSearchQuery(""); // Reset search
      setShowSuggestions(false);
      setSuggestions([]); // Clear suggestions
    },
    [setValue],
  );

  const handleClose = () => {
    setShowSuggestions(false);
  };

  /**
   * Fetch suggestions with debounce
   */
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      const results = googleApiKey
        ? await fetchGooglePlacesSuggestions(searchQuery, googleApiKey)
        : await fetchNominatimSuggestions(searchQuery, language);

      setSuggestions(results);
      setLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [searchQuery, language, googleApiKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={() => setShowSuggestions(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]} numberOfLines={1}>
          {value || placeholder || t("renderer.defaultAddressInput.enterAddress")}
        </Text>
        <Text style={styles.icon}>📍</Text>
      </TouchableOpacity>

      <Modal visible={showSuggestions} transparent animationType="fade" onRequestClose={handleClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || node.data.name}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={placeholder || t("renderer.defaultAddressInput.enterAddress")}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
              />
              {loading && <ActivityIndicator size="small" color="#3B82F6" style={styles.searchLoader} />}
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.loadingText}>{t("renderer.defaultAddressInput.searching")}</Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                keyExtractor={(_, index) => index.toString()}
                style={styles.suggestionsList}
                contentContainerStyle={styles.suggestionsListContent}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  searchQuery.length >= 3 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>{t("renderer.defaultAddressInput.noAddressesFound")}</Text>
                    </View>
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>{t("renderer.defaultAddressInput.typeMinChars")}</Text>
                    </View>
                  )
                }
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    color: "#6B7280",
    fontSize: 24,
    fontWeight: "300",
  },
  container: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
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
    paddingVertical: 24,
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
    marginLeft: 8,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: "80%",
    padding: 16,
    width: "90%",
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
  },
  required: {
    color: "#EF4444",
  },
  searchContainer: {
    marginBottom: 12,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    color: "#374151",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingRight: 40,
    paddingVertical: 10,
  },
  searchLoader: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  suggestionItem: {
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  suggestionsList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  suggestionsListContent: {
    flexGrow: 0,
  },
  suggestionText: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
  },
  trigger: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerError: {
    borderColor: "#EF4444",
  },
  triggerPlaceholder: {
    color: "#9CA3AF",
  },
  triggerText: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
  },
});

export default DefaultAddressInput;
