import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslate } from "@/renderer/hooks/useTranslate";
import { InputRenderProps } from "@/renderer/types/renderer";
import { SerializableFile } from "@/renderer/utils/file";

type PickResult = {
  uri: string;
  name: string;
  size: number;
  type: string;
};

type PickFunction = (options?: { allowMultiSelection?: boolean; type?: string[] }) => Promise<PickResult[]>;

const DefaultFileInput = ({ node, value, setValue, error, label, helperText }: InputRenderProps<"file">) => {
  const [pick, setPick] = useState<PickFunction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslate();
  const files: SerializableFile[] = Array.isArray(value) ? value : value ? [value] : [];
  const isMultiple = node.data.multiple;

  const handlePickFile = useCallback(async () => {
    if (!pick) {
      return;
    }

    try {
      const results = await pick({
        allowMultiSelection: isMultiple,
      });

      const newFiles: SerializableFile[] = results.map((result: PickResult) => ({
        data: result.uri,
        lastModified: Date.now(),
        name: result.name,
        size: result.size,
        type: result.type || "application/octet-stream",
      }));

      if (isMultiple) {
        setValue([...files, ...newFiles]);
      } else {
        setValue(newFiles[0] || null);
      }
    } catch (err) {
      if ((err as { code?: string }).code !== "DOCUMENT_PICKER_CANCELED") {
        Alert.alert("Error", t("renderer.defaultInputs.filePickerError"));
      }
    }
  }, [pick, files, isMultiple, setValue, t]);

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setValue(newFiles.length > 0 ? newFiles : null);
    },
    [files, setValue],
  );

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  useEffect(() => {
    const loadDocumentPicker = async () => {
      try {
        // @ts-expect-error - Optional peer dependency, may not be installed
        const { pick: pickFunction } = await import("react-native-document-picker");
        setPick(() => pickFunction);
      } catch {
        setPick(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDocumentPicker();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!pick) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label || node.data.name}
          {node.data.required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>{t("renderer.defaultInputs.filePickerUnavailable")}</Text>
        </View>
        {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }

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

      <TouchableOpacity style={styles.pickButton} onPress={handlePickFile} activeOpacity={0.7}>
        <Text style={styles.pickButtonText}>
          {files.length === 0
            ? t(isMultiple ? "renderer.defaultInputs.selectFiles" : "renderer.defaultInputs.selectFile")
            : t(isMultiple ? "renderer.defaultInputs.addMoreFiles" : "renderer.defaultInputs.replaceFile")}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
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
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  pickButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderStyle: "dashed",
    borderWidth: 2,
    justifyContent: "center",
    paddingVertical: 16,
  },
  pickButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
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
  unavailableContainer: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    paddingVertical: 16,
  },
  unavailableText: {
    color: "#991B1B",
    fontSize: 12,
    textAlign: "center",
  },
});

export default DefaultFileInput;
