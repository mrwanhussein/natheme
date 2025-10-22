import { useEffect, useState } from "react";
import { api } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/").then((res) => setMessage(res.data));
  }, []);

  return <h1>hello</h1>;
}

export default App;
