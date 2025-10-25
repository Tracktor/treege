/**
 * Represents a serializable file object with base64 data
 */
export interface SerializableFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: string; // base64 encoded
}

/**
 * Converts a File object to a serializable format with base64 data
 */
export const fileToSerializable = (file: File): Promise<SerializableFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      resolve({
        data: base64,
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Converts a SerializableFile back to a File object
 */
export const serializableToFile = (serializable: SerializableFile): File => {
  // Extract base64 data (remove data URL prefix like "data:image/png;base64,")
  const base64Data = serializable.data.split(",")[1];
  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: serializable.type });

  return new File([blob], serializable.name, {
    lastModified: serializable.lastModified,
    type: serializable.type,
  });
};

/**
 * Converts multiple File objects to serializable format
 */
export const filesToSerializable = (files: File[]): Promise<SerializableFile[]> => {
  return Promise.all(files.map((file) => fileToSerializable(file)));
};
