import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [userId, setUserId] = useState('');
  const [similarJobs, setSimilarJobs] = useState([]);
  useEffect(() => {
    console.log('Hello from popup')
    /* eslint-disable no-undef */
    chrome.runtime.sendMessage({ msg: "getUserId" }, (response) => {
      console.log(response);
      setUserId(response.userId)
    });

    chrome.storage.local.get(["similarJobs"]).then((result) => {
      console.log(result.similarJobs);
      setSimilarJobs(result.similarJobs || [])
    });
  }, []);

  /* eslint-disable no-undef */


  return (
    <div className="App">
      <p className="read-the-docs">{ userId }</p>
      <p>{similarJobs.length}</p>
      {
        similarJobs.map(job => (
          <div style={{border: '1px solid red', borderRadius: '4px'}}>
            <div>
              {job.jobboard}
            </div>
            <div>
              {job.title}
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default App;
