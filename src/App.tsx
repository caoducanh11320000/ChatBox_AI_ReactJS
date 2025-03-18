import OpenAI from "openai";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const client = new OpenAI({
    baseURL: "https://api.together.xyz/v1",
    apiKey: "d33017896c9d0aa9d60f0a55fae1f2b9d7715ce9e17f7014d1f049ea95b77652", 
    dangerouslyAllowBrowser: true,
  });

// Kiểm tra tin nhắn có phải của bot không
function isBotMessage(chatMessage) {
    return chatMessage.role === "assistant";
}

function App() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [api_key, set_apikey] = useState("");

    // Xử lý khi gửi tin nhắn
    const submitForm = async (e) => {
        e.preventDefault()

        // if (api_key === "")
        // {
        //   toast.error("Vui lòng nhập API Key trước khi hỏi", {
        //     position: "top-center",
        //     autoClose: 3000, // 3 giây tự động ẩn
        //   });
        //   setMessage("")
        //   return
        // }

        const userMessage = { role: "user", content: message }
        const chat_completion = await client.chat.completions.create({
            messages : [...chatHistory, userMessage],
            model : "meta-llama/Llama-3-70b-chat-hf",
        });
        const botMessage = {role: "assistant", content : chat_completion.choices[0].message.content}

        setChatHistory([...chatHistory, userMessage, botMessage])
        setMessage("")
    };

    return (
        <div className="bg-gray-100 h-screen flex flex-col">
          <ToastContainer /> {/* Quan trọng: Phải có để toast hiển thị */}
            <div className="container mx-auto p-4 flex flex-col h-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4">ChatUI với React + OpenAI</h1>

                <form className="flex">
                  <input 
                    type="text"
                    placeholder="Nhập vào API Key của bạn ..."
                    onChange={(e) => set_apikey(e.target.value)}
                    className="flex-grow p-2 rounded-l border border-gray-300"
                  >
                  </input>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                  >
                    Enter API Key
                  </button>
                </form>

                {/* Form nhập tin nhắn */}
                <form className="flex" onSubmit={submitForm}>
                    <input
                        type="text"
                        placeholder="Tin nhắn của bạn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow p-2 rounded-l border border-gray-300"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                    >
                        Gửi tin nhắn
                    </button>
                </form>

                {/* Hiển thị lịch sử tin nhắn */}
                <div className="flex-grow overflow-y-auto mt-4 bg-white rounded shadow p-4">
                    {chatHistory.map((chatMessage, i) => (
                        <div key={i} className={`mb-2 ${isBotMessage(chatMessage) ? "text-right" : ""}`}>
                            <p className="text-gray-600 text-sm">
                                {isBotMessage(chatMessage) ? "Bot" : "User"}
                            </p>
                            <p className={`p-2 rounded-lg inline-block ${isBotMessage(chatMessage) ? "bg-green-100" : "bg-blue-100"}`}>
                                {chatMessage.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;






// import { useState } from "react";
// import OpenAI from "openai";

// const client = new OpenAI({
//   baseURL: "https://api.together.xyz/v1",
//   apiKey: "d33017896c9d0aa9d60f0a55fae1f2b9d7715ce9e17f7014d1f049ea95b77652", // Thay thế bằng API key của bạn
//   dangerouslyAllowBrowser: true,
// });

// export default function ChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;
    
//     const newMessages = [...messages, { text: input, sender: "user" }];
//     setMessages(newMessages);
//     setInput("");
    
//     try {
//       const chatCompletion = await client.chat.completions.create({
//         model: "meta-llama/Llama-3-70b-chat-hf",
//         messages: [{ role: "user", content: input }],
//       });
      
//       const aiMessage = chatCompletion.choices?.[0]?.message?.content || "Không có phản hồi từ AI.";
      
//       setMessages([...newMessages, { text: aiMessage, sender: "ai" }]);
//     } catch (error) {
//       console.error("Lỗi gửi tin nhắn:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white h-[500px]">
//       <div className="flex-1 overflow-y-auto p-2 border-b">
//         {messages.map((msg, index) => (
//           <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}> 
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex mt-2">
//         <input 
//           type="text" 
//           value={input} 
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 p-2 border rounded-lg"
//           placeholder="Nhập tin nhắn..."
//         />
//         <button onClick={sendMessage} className="ml-2 p-2 bg-blue-600 text-white rounded-lg">Gửi</button>
//       </div>
//     </div>
//   );
// }

