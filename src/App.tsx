import Treege from "@/features/Treege";

const App = () => (
  <Treege
    initialTree={{
      attributes: {
        depth: 0,
        isLeaf: true,
        isRoot: true,
        label: "Test",
        type: "text",
      },
      children: [],
      name: "Homme",
    }}
    authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWRyZSIsImV4cCI6MTY2NjA3NTg4Nn0.ETSmwCWrLmJjpmgqIpQoKnly-BGH4cJi5BkSSRy-7kQ"
    endPoint="https://stg.api.tracktor.fr"
  />
);

export default App;
