export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-loara-50 via-white to-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-loara-200 border-t-loara-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Carregando planejamento...</p>
      </div>
    </div>
  )
}
