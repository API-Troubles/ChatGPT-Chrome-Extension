async function callApi() 
{
  let apiKey = await chrome.storage.local.get('apiKey');
  let url = await getUrl()
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.apiKey}`
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

async function getUrl()
{
  result = await chrome.storage.local.get('useArcadeApi');
  if (result) {
    return "https://jamsapi.hackclub.dev/openai/chat/completions"
  } else {
    return "https://api.openai.com/v1/chat/completions"
  }
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


async function saveKey()
{
    key = document.getElementById('keyInput').value;
    if (key != "") {
        await chrome.storage.local.set({"apiKey": key});
        console.log("saved following apiKey: " + key);
    }
}


async function saveKeyType() {
  var checkBox = document.getElementById("toggle-btn");
  await chrome.storage.local.set({ useArcadeApi: checkBox.checked })

  console.log(checkBox.checked);
}

// Return user settings on load
// Learned to wait until things load from my last project lol
document.addEventListener("DOMContentLoaded", (event) => {
  chrome.storage.local.get('useArcadeApi', function(result) {
    if (result.useArcadeApi) {
      document.getElementById("toggle-btn").checked = true;
    } else {
      document.getElementById("toggle-btn").checked = true;
    }
  });

  document.getElementById("ask-btn").addEventListener("click", callApi);
  document.getElementById("save-btn").addEventListener("click", saveKey);
  document.getElementById("toggle-btn").addEventListener("click", saveKeyType);
});