import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [similarJobs, setSimilarJobs] = useState([]);
  const [forms, setForms] = useState([]);
  const [currentTab, setCurrentTab] = useState('REC');
  useEffect(() => {
    console.log("Hello from popup");
    /* eslint-disable no-undef */
    chrome.runtime.sendMessage({ msg: "getUserId" }, (response) => {
      console.log(response);
      setUserId(response.userId);
    });

    chrome.storage.local.get(["similarJobs"]).then((result) => {
      console.log(result.similarJobs);
      setSimilarJobs(result.similarJobs || []);
    });

    fetch(`https://mojojojo.prod.joveo.com/candidates/153/forms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((resp) => {
        console.log("_+_+_+_+_+_+_+_+_+");
        console.log(resp);
        setForms(resp);
      });
  }, []);

  /* eslint-disable no-undef */

  return (
    <div className="App">
      <nav className="navbar">
        <div className="part1">
          <div className="logoarea">
            <img src="https://i.ibb.co/KVDwhx6/mojodojologo.png" /> &nbsp;&nbsp;{" "}
            <h4 className="logoname">Mojo Dojo</h4>
          </div>
          <div>
            <img
              className="profileicon"
              src="https://i.ibb.co/zV4t5rd/userprofile.png"
            />
          </div>
        </div>
        <div className="part2">
        <div class="tab">
          <button class="tablinks" onClick={(e) => setCurrentTab('REC')} >Recommended Jobs</button>
          <button class="tablinks" onClick={(e) => setCurrentTab('FORM')} >Incomplete forms</button>
        </div>
        </div>
      </nav>
      <div style={{display: currentTab === 'REC' ? 'block' : 'none'}}>
      <h3 className="recommendedjbcss">
        Recommended Jobs ({similarJobs.length}) for you
      </h3>
      <p className="recommendedcaption">
        Based on your profile and search history
      </p>
      {similarJobs.map((job) => (
        <article class="job-card">
          <div className="jobboardarea">
            <img className="jobboardimg" src={job.jobboard_image_url} />{" "}
            <p className="jobboardname">{job.jobboard}</p>
          </div>
          <div className="jobdetailarea">
            <div className="joblogo">
              <img
                className="joblogoimg"
                src="https://i.ibb.co/dL1kFWc/sample.png"
              />
            </div>
            <div className="jobdesc">
              <p className="jbtitle">{job.title}</p>
              <p className="jbcompany">{job.company}</p>
              <p className="jblocation">{job.location}</p>
            </div>
            <div className="jobshare">
              <a>Share</a>
            </div>
          </div>
          <div className="jobotherarea">
            <p className="postedarea">
              <b>Posted :</b> 2 Days ago
            </p>
            <p className="activerecruite">Actively recruiting</p>
          </div>
          <button className="apply-submit">Apply now</button>
        </article>
        // <div style={{border: '1px solid red', borderRadius: '4px'}}>
        //   <div>
        //     {job.jobboard}
        //   </div>
        //   <div>
        //     {job.title}
        //   </div>
        // </div>
      ))}
      </div>
      <div style={{display: currentTab === 'FORM' ? 'block' : 'none'}}>
      {forms.map((form) => (
        <div style={{ border: "1px solid red", borderRadius: "4px" }}>
          <div>{form.percentComplete}</div>
          <div>
            <a href={form.url} target="_blank">
              {form.url}
            </a>
          </div>
          <div>{form.job_data && form.job_data.title}</div>
        </div>
      ))}
      </div>
      
    </div>
  );
}

export default App;
