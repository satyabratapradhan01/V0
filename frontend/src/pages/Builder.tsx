import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

function Builder() {
  const location = useLocation();
  const prompt = (
  location.state as { prompt?: string } | null
)?.prompt;
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");


  if(!prompt?.trim()){
    return <Navigate to="/" replace />
  }


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                {/* <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                /> */}
              </div>
              <div>
                <div className="flex">
                  <br />
                  {(loading || !templateSet)}
                  {!(loading || !templateSet) && (
                    <div className="flex">
                      <textarea
                        value={userPrompt}
                        onChange={(e) => {
                          setPrompt(e.target.value);
                        }}
                        className="p-2 w-full"
                      ></textarea>
                      <button
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            content: userPrompt,
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(
                            `/chat`,
                            {
                              messages: [...llmMessages, newMessage],
                            },
                          );
                          setLoading(false);

                          setLlmMessages((x) => [...x, newMessage]);
                          setLlmMessages((x) => [
                            ...x,
                            {
                              role: "assistant",
                              content: stepsResponse.data.response,
                            },
                          ]);

                          // setSteps((s) => [
                          //   ...s,
                          //   ...parseXml(stepsResponse.data.response).map(
                          //     (x) => ({
                          //       ...x,
                          //       status: "pending" as "pending",
                          //     }),
                          //   ),
                          // ]);
                        }}
                        className="bg-purple-400 px-4"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-span-1">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div> */}
          {/* <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === "code" ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Builder;
