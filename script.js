async function callApi() 
{
  await fetch(getUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${chrome.storage.local.get('apiKey', function(result) {
        return result.apiKey;
      })}`
    },

    body: JSON.stringify(
      {'model': 'gpt-3.5-turbo',
        'messages': [
          {'role': 'system','content': "You are a helpful AI which should reply concisely. Avoid using markdown which affects text sizing, like #s, others you are free to use as needed. Focus on delivering the user's message/goal with as few words as possible, and just go straight into the prompt! Remain knowledgeable and provide accurate information above all else."},
          {'role': 'user','content': document.getElementById("textArea").value}
        ],
      }
    )
  })
  .then(result => result.json())
  .then(response => {

  console.log(response)

  let response_txt = response.choices[0].message.content;

  document.getElementById("response").textContent = '';

  document.getElementById("response").style.display = "block";
  typeResponse(response_txt);
  })
}

function getUrl()
{
  chrome.storage.local.get('useArcadeApi', function(result) {
    if (result.useArcadeApi.useArcadeApi == "true") { // Why true as a string? idk thats just how it is
      return "https://jamsapi.hackclub.dev/openai/chat/completions"
    } else {
      return "https://api.openai.com/v1/chat/completions"
    }
  });
}

function typeResponse(response_txt, index = 0)
{
  const container = document.getElementById('response');

  if (index < response_txt.length) {
      container.textContent += response_txt.charAt(index);
      index++;
      setTimeout(typeResponse, 50, response_txt, index);
  }
}


function saveKey()
{
    key = document.getElementById('keyInput').value;
    if (key != "") {
        chrome.storage.local.set({"apiKey": String(key)}, function(result) { console.log('Value of key is:', result); });
        console.log("saved following apiKey: " + key);
    }
}


function saveKeyType() {
  var checkBox = document.getElementById("toggle-btn");

  if (checkBox.checked) {
    console.log("Saved useArcadeApi: true");
    chrome.storage.local.set({"useArcadeApi": "true"}, function(result) { console.log('true?:', result); });
  } else {
    console.log("Saved useArcadeApi: false");
    chrome.storage.local.set({"useArcadeApi": "false"}, function(result) { console.log('false?:', result); });
  }
}

// Return user settings on load
// Learned to wait until things load from my last project lol
document.addEventListener("DOMContentLoaded", (event) => {
  chrome.storage.local.get('useArcadeApi', function(result) {
    if (result.useArcadeApi == "true") { // Why true as a string? idk thats just how it is
      document.getElementById("toggle-btn").checked = true;
    } else {
      document.getElementById("toggle-btn").checked = true;
    }
  });

  document.getElementById("ask-btn").addEventListener("click", callApi);
  document.getElementById("save-btn").addEventListener("click", saveKey);
  document.getElementById("toggle-btn").addEventListener("click", saveKeyType);

});