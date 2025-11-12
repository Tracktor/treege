import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TreegeRenderer } from "treege/renderer-native";

const exampleFlow = {
  id: "example-flow",
  nodes: [
    {
      id: "1",
      type: "ui",
      position: { x: 0, y: 0 },
      data: {
        type: "title",
        label: "React Native Form Example",
      },
    },
    {
      id: "2",
      type: "input",
      position: { x: 0, y: 100 },
      data: {
        type: "text",
        name: "firstName",
        label: "First Name",
        placeholder: "Enter your first name",
        required: true,
      },
    },
    {
      id: "3",
      type: "input",
      position: { x: 0, y: 200 },
      data: {
        type: "number",
        name: "age",
        label: "Age",
        placeholder: "Enter your age",
        helperText: "You must be 18 or older",
      },
    },
    {
      id: "4",
      type: "input",
      position: { x: 0, y: 300 },
      data: {
        type: "password",
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        required: true,
      },
    },
    {
      id: "5",
      type: "input",
      position: { x: 0, y: 400 },
      data: {
        type: "textarea",
        name: "bio",
        label: "Bio",
        placeholder: "Tell us about yourself",
        helperText: "Max 200 characters",
      },
    },
    {
      id: "6",
      type: "input",
      position: { x: 0, y: 500 },
      data: {
        type: "switch",
        name: "newsletter",
        label: "Subscribe to newsletter",
      },
    },
    {
      id: "7",
      type: "input",
      position: { x: 0, y: 600 },
      data: {
        type: "select",
        name: "country",
        label: "Country",
        placeholder: "Select your country",
        options: [
          { value: "fr", label: "France" },
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "de", label: "Germany" },
        ],
      },
    },
    {
      id: "8",
      type: "input",
      position: { x: 0, y: 700 },
      data: {
        type: "radio",
        name: "gender",
        label: "Gender",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      },
    },
    {
      id: "9",
      type: "input",
      position: { x: 0, y: 800 },
      data: {
        type: "checkbox",
        name: "interests",
        label: "Interests",
        multiple: true,
        options: [
          { value: "sports", label: "Sports" },
          { value: "music", label: "Music" },
          { value: "reading", label: "Reading" },
          { value: "travel", label: "Travel" },
        ],
      },
    },
  ],
  edges: [],
};

export default function App() {
  const handleSubmit = (values: any) => {
    Alert.alert("Form Submitted", JSON.stringify(values, null, 2), [{ text: "OK" }]);
  };

  return (
    <View style={styles.container}>
      <TreegeRenderer
        flows={[exampleFlow]}
        onSubmit={handleSubmit}
        contentContainerStyle={styles.scrollContent}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
