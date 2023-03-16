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
  }
});

window.onload = (event) => {
  setTimeout(() => {
    addReferBtn();
  }, 2000);
};

const addReferBtn = () => {
  const linkedInsaveButton = document.querySelector(".jobs-save-button");
  var referBtn = document.createElement("button");
  referBtn.innerHTML = "Refer";
  referBtn.className = "linkedin-refer-btn";
  referBtn.addEventListener("click", toggleModal);

  const modalString = `
    <div class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <input class='refer-email' type='email'/>
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

