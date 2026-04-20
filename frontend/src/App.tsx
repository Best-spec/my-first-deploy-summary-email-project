import Header from './components/Header';
import AnalysisActions from './components/btn_analysis';
import ChartsSection from './components/ChartsSection';
import { useUpdateTitle } from './hooks/updata_title';

function App() {
  const { title, updateTitle } = useUpdateTitle();
  const handleLogout = () => {
    console.log('logout clicked');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-20">
      <Header role="Admin" username="username@example.com" onLogout={handleLogout} />
      <AnalysisActions title={title} onToggle={updateTitle} />
        <ChartsSection />
      <main className="px-20 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Welcome to the dashboard</h1>
          <p className="mt-2 text-slate-600">This is the new header component with role, username, and logout button.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
