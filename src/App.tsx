import { useState } from "react";
import Desktop from "./components/Desktop";
import { BootScreen } from "./components/BootScreen";

function App() {
  const [isBooting, setIsBooting] = useState(true);

  if (isBooting) {
    return <BootScreen onFinish={() => setIsBooting(false)} />
  }
  return (
        <Desktop />
  );
}

export default App;
