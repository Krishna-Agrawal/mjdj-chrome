console.log("Hello from background script!");
let userId = null;
let email = 'krishna@joveo.com';

// create user on initial load
chrome.runtime.onInstalled.addListener(({ reason }) => {
  // chrome.storage.sync.get(['email'], function(items) {
  //   console.log('Settings retrieved', items);
  // });
  if (
    reason === chrome.runtime.OnInstalledReason.INSTALL ||
    reason === chrome.runtime.OnInstalledReason.UPDATE
  ) {
    fetch("https://mojojojo.prod.joveo.com/initCandidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((resp) => {
        console.log(resp);
        console.log("setting initial userId");
        userId = resp.id;
      });


      getSimilarJobs()
  }
});

// listening to tab updates
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  console.log("TAB UPDATED");
  let url = await getCurrentTabUrl();
  console.log(url);

  if(url.includes('linkedin')) {
    let params = new URL(url).searchParams;
    const keywords = params.get("keywords")
    console.log(keywords)
    if(keywords) {
      getSimilarJobs(keywords)
    }
  }
  

  if (changeInfo.url) {
    chrome.tabs.sendMessage( tabId, {
      message: 'url_change',
      url: changeInfo.url,
      userId: userId
    })
  }
});


// send userId to popup and call refer function
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.msg === "getUserId") {
    sendResponse({ userId: userId });
  }
  if (request.msg === "refer") {
    console.log(request)
    referFriend(request.data)
  } 
  return true;
});


//refer friend
const referFriend = (data) => {
    fetch(`https://mojojojo.prod.joveo.com/candidates/${userId}/refer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((resp) => {
          console.log(resp);
        });
}

const getSimilarJobs = (keywords) => {
  const body = {};
  if(keywords) {
    body['keywords'] = [keywords]
  }
  fetch(`https://mojojojo.prod.joveo.com/jobs/similar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((resp) => {
          console.log('########')
          console.log(resp);
          chrome.storage.local.set({'similarJobs': resp});
        });
}

// util functions
async function getCurrentTabUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
  }