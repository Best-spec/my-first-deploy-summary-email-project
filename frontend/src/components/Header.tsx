interface HeaderProps {
  role: string;
  username: string;
  onLogout: () => void;
}

export default function Header({ role, username, onLogout }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-20 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-10 w-10 rounded-full border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-100 transition"
          aria-label="Open sidebar"
        >
          <span className="text-lg">☰</span>
        </button>
        <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
          D
        </div>
        <div>
          <div className="text-sm text-slate-900 uppercase tracking-[0.2em]">DASHBOARD</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm text-slate-500">{role}</div>
          <div className="font-semibold text-slate-900">{username}</div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}
