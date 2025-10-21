import { useState } from "react";
import Desktop from "./components/Desktop";
import { BootScreen } from "./components/BootScreen";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <ThemeProvider>
      {isBooting ? (
        <BootScreen onFinish={() => setIsBooting(false)} />
      ) : (
        <Desktop />
      )}
    </ThemeProvider>
  );
}

export default App;
