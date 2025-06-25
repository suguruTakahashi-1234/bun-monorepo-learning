import { checkDependency, getSharedVersion, isSharedLoaded } from "@monorepo/shared";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [serverDeps, setServerDeps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // サーバーの依存関係情報を取得
    fetch('http://localhost:3001/api/dependencies')
      .then(res => res.json())
      .then(data => {
        setServerDeps(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const webDependencies = {
    package: "web",
    version: "1.0.0",
    dependencies: {
      shared: {
        status: checkDependency(),
        version: getSharedVersion(),
        loaded: isSharedLoaded()
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Bun Monorepo 依存関係チェッカー</h1>
      
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h2>Webパッケージの依存関係</h2>
        <pre>{JSON.stringify(webDependencies, null, 2)}</pre>
      </div>

      <div style={{ padding: "10px", backgroundColor: "#e8f4f8" }}>
        <h2>Serverパッケージの依存関係</h2>
        {loading ? (
          <p>サーバーに接続中...</p>
        ) : serverDeps ? (
          <pre>{JSON.stringify(serverDeps, null, 2)}</pre>
        ) : (
          <p style={{ color: "red" }}>サーバーに接続できませんでした。`bun run dev`でサーバーを起動してください。</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>依存関係グラフ:</h3>
        <pre style={{ lineHeight: "1.5" }}>
{`web
└── shared

server
├── shared
└── database
    └── shared`}
        </pre>
      </div>
    </div>
  );
}

// biome-ignore lint/style/noNonNullAssertion: root要素は存在することが保証されている
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);