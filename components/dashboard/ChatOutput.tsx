import { useEffect, useState } from "react";
import ProgressSteps from "../general/ProgressSteps";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { chatGenerate } from "@/lib/apiFunctions";
import { useProgressStore } from "@/hooks/useModelStore";

type Chat = {
  response: string;
  user: string;
};

const ChatOutput = () => {
  const { increase } = useProgressStore();
  const [inputText, setInputText] = useState<string>("");
  const [initFlag, setInitFlag] = useState<boolean>(true);
  const [chatText, setChatText] = useState<Chat[]>([]);
  const [convoKey, setConvoKey] = useState<string>("");
  const [historyPath, setHistoryPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const chatCall = async () => {
      setLoading(true);
      const response = await chatGenerate(initFlag);
      if (response.success) {
        if (response.respdata.ai_response !== chatText[chatText.length - 1]) {
          setChatText([
            ...chatText,
            { response: response.respdata.ai_response, user: "AI" },
          ]);
        }

        setHistoryPath(response.respdata.history_path);
        setInitFlag(false);
        if (response.respdata.convo_key !== null) {
          setConvoKey(response.respdata.convo_key);
        } else {
          setConvoKey("");
        }
        setInitFlag(false);
      }
      setLoading(false);
    };
    if (initFlag) {
      chatCall();
    }
  }, []);

  const chatCall = async () => {
    setLoading(true);
    const response = await chatGenerate(
      initFlag,
      convoKey,
      historyPath,
      inputText
    );
    if (response.success) {
      if (!response.respdata.continue) {
        localStorage.setItem("convo_key", response.respdata.convo_key);
        setTimeout(() => {
          increase(25);
          return;
        }, 1000);
      }
      if (response.respdata.ai_response !== chatText[chatText.length - 1]) {
        setChatText([
          ...chatText,
          { response: response.respdata.ai_response, user: "AI" },
        ]);
      }
      setHistoryPath(response.respdata.history_path);
      setConvoKey(response.respdata.convo_key);
    } else {
      let temp = {
        response: "Failed to initialize chat",
        user: "ai",
      };
      setChatText((prev) => [...prev, temp]);
    }
    setLoading(false);
  };

  return (
    <>
      <ProgressSteps />
      <div className="flex flex-col justify-between h-screen">
        <div>
          <ul className="mt-16 space-y-5">
            {chatText.map((text, index) => {
              if (text.user === "ai") {
                return (
                  <li className="py-2 sm:py-4" key={index}>
                    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
                      <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
                        <Avatar className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
                          <AvatarFallback className="text-sm font-medium leading-none bg-black text-white">
                            NN
                          </AvatarFallback>
                        </Avatar>

                        <div className="grow mt-2 space-y-3">
                          <p className="text-gray-800 dark:text-gray-200">
                            {text.response}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              } else {
                return (
                  <li className="py-2 sm:py-4">
                    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
                      <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
                        <Avatar className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
                          <AvatarFallback className="text-sm font-medium leading-none ">
                            U
                          </AvatarFallback>
                        </Avatar>

                        <div className="grow mt-2 space-y-3">
                          <p className="text-gray-800 dark:text-gray-200">
                            {text.response}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }
            })}
            {loading && <div>Loading...</div>}
          </ul>
        </div>
        <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-slate-900 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative border rounded-md">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Ask me anything..."
              ></textarea>

              <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-1">
                    <button
                      type="button"
                      onClick={chatCall}
                      className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChatOutput;
