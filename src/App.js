import "./App.css";
import { useState } from "react";
import MindARThreeViewer from "./component/MindARThreeViewer";

function App() {
  const [viewWithThree, setViewWithThree] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setViewWithThree(!viewWithThree)}>
        open Three
      </button>

      {viewWithThree && <MindARThreeViewer />}
    </div>
  );
}

export default App;
