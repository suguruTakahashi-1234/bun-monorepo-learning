// UIコンポーネントのエクスポート

export { Button } from './Button';

// ボタンコンポーネント
export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0070f3',
        color: 'white',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}