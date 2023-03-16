import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [userId, setUserId] = useState('');
  useEffect(() => {
    console.log('Hello from popup')
    /* eslint-disable no-undef */
    chrome.runtime.sendMessage({ msg: "getUserId" }, (response) => {
      console.log(response);
      setUserId(response.userId)
    });
  }, []);

  /* eslint-disable no-undef */


  return (
    <div className="App">
      <p className="read-the-docs">Let's get started</p>
      <p className="read-the-docs">{ userId }</p>
    </div>
  );
}

export default App;
