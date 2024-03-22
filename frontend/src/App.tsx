import { useState } from "react";
// import "./App.css";

export default function App() {
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState();
  const [file, setFile] = useState<File | null>(null);

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
    alert("File has been uploaded successfully");
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // Check if file size is greater than 130MB
    if (file && file.size > 100 * 1024 * 1024) {
      alert("File size exceeds 100MB. Please upload a smaller file.");
      return;
    }

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.result);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleClearResponse = () => {
    setResult("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <label htmlFor="question" className="mb-2 font-bold text-gray-700">
            Question:
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask your question here"
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="file" className="mb-2 font-bold text-gray-700">
            Upload a file:
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv,.txt,.pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            disabled={!file || !question}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClearResponse}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            Clear Response
          </button>
        </div>
      </form>

      {result && (
        <div className="w-full max-w-md p-4 mt-6 bg-white rounded-md shadow">
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
}
