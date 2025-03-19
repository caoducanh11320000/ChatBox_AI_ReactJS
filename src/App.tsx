import OpenAI from "openai";
import { useState, useEffect } from "react";
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

async function streamResponse(messages, updateChat) {
    const response = await client.chat.completions.create({
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages: messages,
        stream: true,  
    });

    let botMessage = { role: "assistant", content: "" };
    updateChat(botMessage); 

    for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        botMessage.content += text;
        updateChat({ ...botMessage }); 
        updateChat(botMessage); 
    }
}


function App() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [api_key, set_apikey] = useState("");

    // Xử lý khi gửi tin nhắn
    const submitForm = async (e) => {
        e.preventDefault()

        const userMessage = { role: "user", content: message }
        const wait_bot_respond = {role: "assistant", content: "... wait a minute"}
        setChatHistory(prevChat => [...prevChat, userMessage, wait_bot_respond])

        await streamResponse([...chatHistory, userMessage], (updatedMessage) => {
            setChatHistory(prevChat => [...prevChat.slice(0, -1), updatedMessage]);
        });

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
