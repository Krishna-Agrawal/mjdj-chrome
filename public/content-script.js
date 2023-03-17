// document.body.style.setProperty('background-color', 'red', 'important');
console.log("content script");


let userId;
let url;
// listening to tab updates and adding refer button
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "url_change") {
    console.log(request.url);
    userId = request.userId;
    url = request.url

    setTimeout(() => {
      addReferBtn();
    }, 2000);

    console.log(url);
  }
});

window.onload = (event) => {
  setTimeout(() => {
    addReferBtn();
  }, 2000);

  setTimeout(() => {
    if(window.location.host.includes('myworkdayjobs')) {
      const inputs = document.querySelectorAll('input')
      console.log(inputs)
      if(inputs) {
        inputs.forEach(input => {
          input.addEventListener('blur', makeForm)
        })
      }
    }
  }, 8000)
  
};

const addReferBtn = () => {
  
  let linkedInsaveButton;
  if(window.location.hostname.includes('linkedin')){
    linkedInsaveButton = document.querySelector(".jobs-save-button");
  } else if(window.location.hostname.includes('indeed')){
    linkedInsaveButton = document.querySelector("#saveJobButtonContainer");
  }
  var referBtn = document.createElement("button");
  referBtn.innerHTML = '<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.439 4.18906L7.58312 8.02502C7.52371 8.08412 7.43432 8.10189 7.35664 8.06985C7.27896 8.0379 7.22824 7.9625 7.22824 7.87886V6.42878C5.90362 6.48495 4.60703 6.82617 3.42774 7.42891C2.24847 8.03172 1.21473 8.88176 0.397487 9.92034C0.344801 9.98759 0.255979 10.0158 0.173879 9.99126C0.0917754 9.9668 0.0332722 9.89466 0.0264716 9.80964C-0.0873421 8.46071 0.167242 7.10619 0.763267 5.88937C1.35921 4.67243 2.27455 3.63834 3.41259 2.89606C4.55062 2.15379 5.86892 1.73121 7.2284 1.67284V0.206781C7.2284 0.123146 7.27912 0.0477433 7.3568 0.0157088C7.43448 -0.0162443 7.52387 0.00144368 7.58328 0.0606231L11.4392 3.89658C11.5203 3.97737 11.5203 4.10821 11.4392 4.18899L11.439 4.18906Z" fill="white"/></svg> &nbsp; Share with friend';
  referBtn.className = "linkedin-refer-btn";
  referBtn.addEventListener("click", toggleModal);

  const modalString = `
    <div class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <div class="bgimgcss"><img class="imgt" src="https://s2.gifyu.com/images/113973-share.gif"/></div>
            <h4 class="h3refer">Refer your friends</h4>
            <p class="captioncss">Enter the email address of your friend and help them find the job</p>
            <input class='refer-email' placeholder="Enter email" type='email'/>
            <button class='refer-submit'>Refer</button>
        </div>
    </div>
`;

  const modal = document.createElement("div");
  modal.innerHTML = modalString.trim();

  const linkedReferButton = document.querySelector(".linkedin-refer-btn");
  if (!linkedReferButton && linkedInsaveButton) {
    document.querySelector("body").appendChild(modal.firstChild);
    
    linkedInsaveButton.parentNode.insertBefore(
      referBtn,
      linkedInsaveButton.nextSibling
    );

    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", toggleModal);

    const referSubmitButton = document.querySelector(".refer-submit");
    referSubmitButton.addEventListener("click", referSubmit);

    window.addEventListener("click", windowOnClick);
  }
};

function toggleModal() {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  const modal = document.querySelector(".modal");
  if (event.target === modal) {
    toggleModal();
  }
}

function referSubmit() {
    const email = document.querySelector(".refer-email");
    console.log(email.value);
    console.log(url)
    console.log(userId)
    const title = document.querySelector(".jobs-unified-top-card__job-title").innerHTML;

    const company = document.querySelector(".jobs-unified-top-card__company-name>a").innerHTML.trim();

    chrome.runtime.sendMessage({ msg: "refer", data: {
        email: email.value,
        url: url,
        title: title,
        company: company
    } });

   
}



function makeForm(event) {
  const data = {}
  const inputs = document.querySelectorAll('input')
  inputs.forEach(input => {
    if(input.value) {
      const key = input.getAttribute('data-automation-id')
      if(key) {
        data[key] = input.value
      }
    }
  })

  const job_data = {title: document.querySelector('h3').innerHTML, time: new Date().valueOf()}
  console.log(job_data)
  chrome.runtime.sendMessage({ msg: "save-form", url: window.location.href, data: data, job_data: job_data });
}
