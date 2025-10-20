import { useState } from "react";
import Desktop from "./components/Desktop";
import { BootScreen } from "./components/BootScreen";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const [isBooting, setIsBooting] = useState(true);

  if (isBooting) {
    return <BootScreen onFinish={() => setIsBooting(false)} />;
  }
  return (
    <ThemeProvider>
      <Desktop />
    </ThemeProvider>
  );
}

export default App;
