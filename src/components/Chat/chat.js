

// THIS SHIT WORKS ---->>>>


// function Chat() {


//     return(
//         <>

//     <body>
// <title>TypeShit - Chat</title>
  
//     <div class="container">
//         <div class="chat-box">
//             <div id="chatOutput"></div>
//             <form id="chatForm">
//                 <input type="text" id="chatInput" placeholder="Type something..." />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     </div>
// </body>
//   </>
//     )
// }





// export default Chat;

// EVERYTHING FORWARD IS A TEST ----->>>>



import React, { useState } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import * as loadingAnimationData from "../../assets/animations/loading.json"; 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/safewaveai';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrompt = async (event) => {
    event.preventDefault();
    const userMessage = event.target.prompt.value;
    const newQuestion = { content: userMessage };

    setMessages(prevMessages => [...prevMessages, { role: "user", content: userMessage }]);
    event.target.prompt.value = ''; // Clear the textbox
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, newQuestion, {
        withCredentials: true
      });
      animateMessage(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const animateMessage = (message) => {
    const words = message.split(" ");
    let displayedMessage = "";
    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "" }]);

    words.forEach((word, index) => {
      setTimeout(() => {
        displayedMessage += (index === 0 ? "" : " ") + word;
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = displayedMessage;
          return updatedMessages;
        });
      }, index * 50); // Adjust the speed of word appearance here (50ms for faster rendering)
    });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <main className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <p dangerouslySetInnerHTML={{ __html: message.content }}></p>
          </div>
        ))}
        {isLoading && (
          <div className="loading-animation">
            <Lottie options={defaultOptions} height={100} width={100} />
          </div>
        )}
      </div>
      <form className="input-form" onSubmit={handlePrompt}>
        <textarea
          type="text"
          name="prompt"
          id="prompt"
          placeholder="Ask your question"
          rows="2"
          className="input-box"
        ></textarea>
        <button type="submit" className="submit-button">Send</button>
      </form>
    </main>
  );
}

export default Chat;




   

