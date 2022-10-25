import Treege from "@/features/Treege";

const App = () => (
  <Treege
    endPoint="https://stg.api.tracktor.fr"
    authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaWNrYSIsImV4cCI6MTY2Njc5OTA4OH0._I7oMj70Taw2CO7QhsC4wREHtZmJ89w5_EpWby-zmR8"
    initialTreeId="599eb8ec-4238-4da3-a064-9016f2f0a838"
    initialTree={{
      attributes: {
        depth: 0,
        isLeaf: true,
        isRoot: true,
        label: "erfgezgf",
        type: "text",
      },
      children: [],
      name: "zef",
    }}
  />
);

export default App;
