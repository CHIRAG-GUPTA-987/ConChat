import "./App.css";
import { Route } from "react-router-dom";
import Chatpage from "./pages/Chatpage";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={Homepage} />
      <Route path="/chats" exact component={Chatpage} />
    </div>
  );
}

export default App;
