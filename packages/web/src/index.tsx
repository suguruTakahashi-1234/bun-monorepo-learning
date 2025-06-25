import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '@monorepo/ui';
import { formatDate, capitalize } from '@monorepo/utils';

function App() {
  const today = formatDate(new Date());
  const title = capitalize('bun workspace デモ');

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <p>今日の日付: {today}</p>
      <Button onClick={() => alert('クリックされました！')}>
        テストボタン
      </Button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);