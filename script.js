function callApi(text) 
{
  fetch('https://jamsapi.hackclub.dev/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
    },

    body: JSON.stringify(
      {'model': 'gpt-3.5-turbo',
        'messages': [
          {'role': 'user','content': text}
        ],
      }
    )
  })
  .then(result => result.json())
  .then(response => {
  return response.choices[0].message.content
  })
}

function getUrl()
{
  if (localStorage.getItem('useArcadeApi') == "true") { // Why true as a string? idk thats just how it is
    return "https://jamsapi.hackclub.dev/openai/chat/completions"
  } else {
    return "https://api.openai.com/v1/chat/completions"
  }
}

function saveKey()
{
    key = document.getElementById('keyInput').value;
    if (key != "") {
        localStorage.setItem('apiKey', key); 
        console.log("saved following apiKey: " + key);
    }
}

function saveKeyType() {
  var checkBox = document.getElementById("toggleApiUrl");

  if (checkBox.checked) {
    console.log("Saved useArcadeApi: true");
    localStorage.setItem('useArcadeApi', true);
  } else {
    console.log("Saved useArcadeApi: false");
    localStorage.setItem('useArcadeApi', false);
  }
}

// Return user settings on load
// Learned to wait until things load from my last project lol
document.addEventListener("DOMContentLoaded", (event) => {
  if (localStorage.getItem('useArcadeApi') == "true") { // Why true as a string? idk thats just how it is
    document.getElementById("toggleApiUrl").checked = true;
  } else {
    document.getElementById("toggleApiUrl").checked = false;
  }
});