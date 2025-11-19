import { useCallback, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { SerializableFile } from "@/renderer/utils/file";

const DefaultFileInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"file">) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const _t = useTranslate();

  const files: SerializableFile[] = Array.isArray(value) ? value : value ? [value] : [];
  const multipleFiles = node.data.multiple;

  const handleAddFile = useCallback(() => {
    if (!(fileName.trim() && fileData.trim())) {
      return;
    }

    const newFile: SerializableFile = {
      data: fileData.trim(),
      lastModified: Date.now(),
      name: fileName.trim(),
      size: 0,
      type: "application/octet-stream",
    };

    if (multipleFiles) {
      setValue([...files, newFile]);
    } else {
      setValue([newFile]);
    }

    setFileName("");
    setFileData("");
    setIsModalOpen(false);
  }, [fileName, fileData, files, multipleFiles, setValue]);

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setValue(newFiles.length > 0 ? newFiles : null);
    },
    [files, setValue],
  );

  const formatFileSize = (size?: number) => {
    if (!size) {
      return "";
    }
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label || node.data.name}
        {node.data.required && <Text style={styles.required}>*</Text>}
      </Text>

      {files.length > 0 && (
        <View style={styles.filesList}>
          {files.map((file, index) => (
            <View key={`${file.name}-${index}`} style={styles.fileItem}>
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>📄</Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                {file.size > 0 && <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>}
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFile(index)} activeOpacity={0.7}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)} activeOpacity={0.7}>
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>
          {files.length === 0 ? (multipleFiles ? "Add files" : "Add file") : multipleFiles ? "Add more" : "Replace file"}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          This is a basic file input. For native file picking, override this component using the `components` prop with
          react-native-document-picker or similar.
        </Text>
      </View>

      <Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalOpen(false)}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add File</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>File name</Text>
              <TextInput
                style={styles.input}
                placeholder="document.pdf"
                placeholderTextColor="#9CA3AF"
                value={fileName}
                onChangeText={setFileName}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>File data (base64 or URI)</Text>
              <TextInput
                style={styles.input}
                placeholder="data:image/png;base64,... or file://..."
                placeholderTextColor="#9CA3AF"
                value={fileData}
                onChangeText={setFileData}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, !(fileName.trim() && fileData.trim()) && styles.confirmButtonDisabled]}
              onPress={handleAddFile}
              disabled={!(fileName.trim() && fileData.trim())}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>Add</Text>
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
  addButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderStyle: "dashed",
    borderWidth: 2,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 16,
  },
  addButtonIcon: {
    color: "#3B82F6",
    fontSize: 20,
    fontWeight: "600",
  },
  addButtonText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
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
  confirmButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.5,
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
  fileIcon: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  fileIconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileItem: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    padding: 12,
  },
  fileName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },
  fileSize: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },
  filesList: {
    marginBottom: 12,
  },
  helperText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
    borderLeftWidth: 4,
    borderRadius: 6,
    marginTop: 12,
    padding: 12,
  },
  infoText: {
    color: "#78350F",
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 1,
    color: "#374151",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
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
    width: "90%",
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
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    color: "#6B7280",
    fontSize: 18,
  },
  required: {
    color: "#EF4444",
  },
});

export default DefaultFileInput;
