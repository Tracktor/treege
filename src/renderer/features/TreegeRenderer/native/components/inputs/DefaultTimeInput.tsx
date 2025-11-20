import { useCallback, useRef, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultTimeInput = ({ node, value, setValue, error, label, placeholder, helperText }: InputRenderProps<"time">) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeValue = value || "";
  const parts = timeValue.split(":");
  const parsedHours = Number.parseInt(parts[0], 10);
  const parsedMinutes = Number.parseInt(parts[1], 10);
  const hours = Number.isNaN(parsedHours) ? 0 : parsedHours;
  const minutes = Number.isNaN(parsedMinutes) ? 0 : parsedMinutes;

  const [selectedHours, setSelectedHours] = useState(hours || 0);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes || 0);

  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = () => {
    if (!value) {
      return placeholder || "Select time";
    }
    return value;
  };

  const handleConfirm = useCallback(() => {
    const timeString = `${String(selectedHours).padStart(2, "0")}:${String(selectedMinutes).padStart(2, "0")}`;
    setValue(timeString);
    setIsOpen(false);
  }, [selectedHours, selectedMinutes, setValue]);

  const handleOpen = () => {
    setSelectedHours(hours || 0);
    setSelectedMinutes(minutes || 0);
    setIsOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={handleOpen} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]} numberOfLines={1}>
          {formatTime()}
        </Text>
        <Text style={styles.icon}>🕐</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || node.data.name}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView
                  ref={hoursScrollRef}
                  style={styles.picker}
                  contentContainerStyle={styles.pickerContent}
                  showsVerticalScrollIndicator={false}
                >
                  {hoursList.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.pickerItem, selectedHours === hour && styles.pickerItemSelected]}
                      onPress={() => setSelectedHours(hour)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pickerItemText, selectedHours === hour && styles.pickerItemTextSelected]}>
                        {String(hour).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView
                  ref={minutesScrollRef}
                  style={styles.picker}
                  contentContainerStyle={styles.pickerContent}
                  showsVerticalScrollIndicator={false}
                >
                  {minutesList.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[styles.pickerItem, selectedMinutes === minute && styles.pickerItemSelected]}
                      onPress={() => setSelectedMinutes(minute)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pickerItemText, selectedMinutes === minute && styles.pickerItemTextSelected]}>
                        {String(minute).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.7}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
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
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 6,
    marginTop: 16,
    paddingVertical: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    marginBottom: 16,
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
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "80%",
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  picker: {
    maxHeight: 200,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  pickerContent: {
    paddingVertical: 8,
  },
  pickerItem: {
    alignItems: "center",
    borderRadius: 6,
    marginVertical: 2,
    paddingVertical: 10,
  },
  pickerItemSelected: {
    backgroundColor: "#3B82F6",
  },
  pickerItemText: {
    color: "#374151",
    fontSize: 18,
  },
  pickerItemTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  pickerLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  pickerSeparator: {
    color: "#374151",
    fontSize: 24,
    fontWeight: "600",
  },
  required: {
    color: "#EF4444",
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

export default DefaultTimeInput;
