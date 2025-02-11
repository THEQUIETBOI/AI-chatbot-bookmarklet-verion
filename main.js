document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const mainContainer = document.querySelector(".main-container");
    const moveButton = document.getElementById("move");
    const chat = document.getElementById("chat");
    let isDragging = false;
    let offsetX, offsetY;
  
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const key = localStorage.getItem("key");
        if (key === null) {
          localStorage.removeItem("key");
          alert("Please enter your API key in the settings.");
          const keys = prompt("enter your API key");
  localStorage.setItem("key", keys);
          return;
        }
        const userInput = input.value;
        if (key) {
          await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
              localStorage.getItem("key"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: userInput }]
                  }
                ]
              })
            }
          )
            .then((response) => response.json())
            .then((data) => {
              if (
                data.candidates &&
                data.candidates.length > 0 &&
                data.candidates[0].content
              ) {
                // Convert response to string and clean it
                const botResponse = data.candidates[0].content.parts[0].text
                  .toString()
                  .trim();
                // Create user message
                const userMessage = document.createElement("p");
                userMessage.className = "userMessage";
                userMessage.textContent = `You: ${userInput}`;
                chat.appendChild(userMessage);
  
                // Create bot message
                const botMessage = document.createElement("p");
                botMessage.className = "botMessage";
                const parsedResponse = marked.parse(botResponse);
  
                if (parsedResponse.includes("<code>")) {
                    // Create a div to wrap code elements
                    const codeWrapper = document.createElement("div");
                    codeWrapper.className = "code-wrapper";
                    codeWrapper.innerHTML = parsedResponse;
                    botMessage.innerHTML = "Bot: ";
                    botMessage.appendChild(codeWrapper);
                } else {
                    botMessage.innerHTML = "Bot: " + parsedResponse;
                }
                chat.appendChild(botMessage);
  
                // Clear input
                input.value = "";
  
                // Scroll to bottom
                chat.scrollTop = chat.scrollHeight;
              }
            })
           
            
        }
        
      }
    });
  
    function handlePointerDown(e) {
      e.preventDefault();
      isDragging = true;
  
      if (e.type === "touchstart") {
        offsetX = e.touches[0].clientX - mainContainer.offsetLeft;
        offsetY = e.touches[0].clientY - mainContainer.offsetTop;
      } else {
        offsetX = e.clientX - mainContainer.offsetLeft;
        offsetY = e.clientY - mainContainer.offsetTop;
      }
  
      document.addEventListener("mousemove", handlePointerMove);
      document.addEventListener("touchmove", handlePointerMove);
      document.addEventListener("mouseup", handlePointerUp);
      document.addEventListener("touchend", handlePointerUp);
      document.addEventListener("mouseleave", handlePointerUp);
    }
  
    function handlePointerMove(e) {
      if (!isDragging) return;
  
      let x, y;
      if (e.type === "touchmove") {
        x = e.touches[0].clientX - offsetX;
        y = e.touches[0].clientY - offsetY;
      } else {
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
      }
  
      mainContainer.style.left = `${x}px`;
      mainContainer.style.top = `${y}px`;
    }
  
    function handlePointerUp() {
      isDragging = false;
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchend", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerUp);
    }
  
    moveButton.addEventListener("mousedown", handlePointerDown);
    moveButton.addEventListener("touchstart", handlePointerDown);
    const hide = document.getElementById("hide");
    document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "e") {
        if (document.activeElement !== input) {
          mainContainer.classList.toggle("hidden");
        }
      }
    });
   
  
  
    const key = document.getElementById("key")
    key.addEventListener("click", () => {
  const ee = prompt("enter your API key");
  localStorage.setItem("key", ee);
    });
  });
  