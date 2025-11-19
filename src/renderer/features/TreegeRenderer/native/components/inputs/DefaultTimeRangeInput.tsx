import { useCallback, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultTimeRangeInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"timerange">) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const t = useTranslate();

  const timeRange = Array.isArray(value) ? value : [];
  const startTime = timeRange[0] || "";
  const endTime = timeRange[1] || "";

  const [startHours, startMinutes] = startTime.split(":").map((v) => (v ? Number.parseInt(v, 10) : 0));
  const [endHours, endMinutes] = endTime.split(":").map((v) => (v ? Number.parseInt(v, 10) : 0));

  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 60 }, (_, i) => i);

  const formatTimeRange = () => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    if (startTime) {
      return startTime;
    }
    return t("renderer.defaultInputs.selectDateRange");
  };

  const handleConfirm = useCallback(() => {
    const timeString = `${String(selectedHours).padStart(2, "0")}:${String(selectedMinutes).padStart(2, "0")}`;

    if (selectingStart) {
      setValue([timeString, endTime]);
      setSelectingStart(false);
      setSelectedHours(endHours || 0);
      setSelectedMinutes(endMinutes || 0);
    } else {
      setValue([startTime, timeString]);
      setIsOpen(false);
      setSelectingStart(true);
    }
  }, [selectingStart, selectedHours, selectedMinutes, startTime, endTime, endHours, endMinutes, setValue]);

  const handleOpen = () => {
    setSelectedHours(startHours || 0);
    setSelectedMinutes(startMinutes || 0);
    setSelectingStart(true);
    setIsOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={handleOpen} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !startTime && styles.triggerPlaceholder]} numberOfLines={1}>
          {formatTimeRange()}
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

            <View style={styles.rangeIndicator}>
              <Text style={styles.rangeIndicatorText}>
                {selectingStart ? t("renderer.defaultInputs.startTime") : t("renderer.defaultInputs.endTime")}
              </Text>
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView style={styles.picker} contentContainerStyle={styles.pickerContent} showsVerticalScrollIndicator={false}>
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
                <ScrollView style={styles.picker} contentContainerStyle={styles.pickerContent} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.confirmButtonText}>{selectingStart ? "Next" : "Confirm"}</Text>
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
  rangeIndicator: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    marginBottom: 12,
    paddingVertical: 8,
  },
  rangeIndicatorText: {
    color: "#3B82F6",
    fontSize: 14,
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

export default DefaultTimeRangeInput;
