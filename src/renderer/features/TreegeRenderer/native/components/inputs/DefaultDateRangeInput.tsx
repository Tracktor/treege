import { useCallback, useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";

const DefaultDateRangeInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"daterange">) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const t = useTranslate();

  const dateRange = Array.isArray(value) ? value : [];
  const startDate = dateRange[0] ? new Date(dateRange[0]) : undefined;
  const endDate = dateRange[1] ? new Date(dateRange[1]) : undefined;

  const { year, month, today } = useMemo(() => {
    const selectedDate = startDate || new Date();
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return { month: m, today: now, year: y };
  }, [startDate]);

  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    const previousMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const calendarDays = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(currentYear, currentMonth - 1, previousMonthDays - i),
        day: previousMonthDays - i,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysCount; day++) {
      calendarDays.push({
        date: new Date(currentYear, currentMonth, day),
        day,
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        date: new Date(currentYear, currentMonth + 1, day),
        day,
        isCurrentMonth: false,
      });
    }

    return calendarDays;
  }, [currentYear, currentMonth]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      if (node.data.disablePast && date < today) {
        return;
      }

      if (selectingStart) {
        setValue([date.toISOString(), endDate?.toISOString()]);
        setSelectingStart(false);
      } else {
        if (startDate && date < startDate) {
          setValue([date.toISOString(), startDate.toISOString()]);
        } else {
          setValue([startDate?.toISOString(), date.toISOString()]);
        }
        setIsOpen(false);
        setSelectingStart(true);
      }
    },
    [node.data.disablePast, today, selectingStart, startDate, endDate, setValue],
  );

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    if (startDate) {
      return startDate.toLocaleDateString();
    }
    return t("renderer.defaultInputs.selectDateRange");
  };

  const isDateDisabled = (date: Date) => {
    if (!node.data.disablePast) {
      return false;
    }
    return date < today;
  };

  const isInRange = (date: Date) => {
    if (!(startDate && endDate)) {
      return false;
    }
    return date >= startDate && date <= endDate;
  };

  const isRangeEdge = (date: Date) => {
    if (!(startDate || endDate)) {
      return false;
    }
    const isStart =
      startDate &&
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear();
    const isEnd =
      endDate &&
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear();
    return isStart || isEnd;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity style={[styles.trigger, error && styles.triggerError]} onPress={() => setIsOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !startDate && styles.triggerPlaceholder]} numberOfLines={1}>
          {formatDateRange()}
        </Text>
        <Text style={styles.icon}>📅</Text>
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
                {selectingStart ? t("renderer.defaultInputs.startDate") : t("renderer.defaultInputs.endDate")}
              </Text>
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <FlatList
              data={days}
              keyExtractor={(item, index) => `${item.date.getTime()}-${index}`}
              numColumns={7}
              scrollEnabled={false}
              style={styles.calendar}
              contentContainerStyle={styles.calendarContent}
              renderItem={({ item }) => {
                const disabled = isDateDisabled(item.date);
                const inRange = isInRange(item.date);
                const edge = isRangeEdge(item.date);

                return (
                  <TouchableOpacity
                    style={[
                      styles.dayCell,
                      !item.isCurrentMonth && styles.dayCellOtherMonth,
                      inRange && styles.dayCellInRange,
                      edge && styles.dayCellSelected,
                      disabled && styles.dayCellDisabled,
                    ]}
                    onPress={() => handleSelectDate(item.date)}
                    disabled={disabled}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !item.isCurrentMonth && styles.dayTextOtherMonth,
                        inRange && styles.dayTextInRange,
                        edge && styles.dayTextSelected,
                        disabled && styles.dayTextDisabled,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    flexGrow: 0,
    flexShrink: 1,
  },
  calendarContent: {
    flexGrow: 0,
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  closeButton: {
    color: "#6B7280",
    fontSize: 24,
    fontWeight: "300",
  },
  container: {
    marginBottom: 16,
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    flex: 1,
    justifyContent: "center",
    margin: 2,
    maxWidth: "14.28%",
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayCellInRange: {
    backgroundColor: "#DBEAFE",
  },
  dayCellOtherMonth: {
    opacity: 0.3,
  },
  dayCellSelected: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
  },
  dayText: {
    color: "#374151",
    fontSize: 14,
  },
  dayTextDisabled: {
    color: "#9CA3AF",
  },
  dayTextInRange: {
    color: "#1E40AF",
  },
  dayTextOtherMonth: {
    color: "#9CA3AF",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
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
  monthYear: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    color: "#3B82F6",
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
  weekDay: {
    color: "#6B7280",
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    maxWidth: "14.28%",
    textAlign: "center",
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 8,
  },
});

export default DefaultDateRangeInput;
