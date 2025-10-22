import { useEffect, useState } from "react";
import { api } from "./api";

function App() {
  const [message, setMessage] = useState("hello natheme");

  useEffect(() => {
    api.get("/").then((res) => setMessage(res.data));
  }, []);

  return <h1>{message}</h1>;
}

export default App;
