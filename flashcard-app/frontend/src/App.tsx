import PracticeView from './components/PracticeView';

// Removed CSS import

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <PracticeView />
      </div>
    </div>
  );
}

export default App;