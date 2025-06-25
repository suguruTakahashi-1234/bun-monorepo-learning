import { Button } from "@monorepo/ui";
import { capitalize, formatDate } from "@monorepo/utils";
import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  const today = formatDate(new Date());
  const title = capitalize("bun workspace デモ");

  return (
    <div style={{ padding: "20px" }}>
      <h1>{title}</h1>
      <p>今日の日付: {today}</p>
      <Button onClick={() => alert("クリックされました！")}>
        テストボタン
      </Button>
    </div>
  );
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
