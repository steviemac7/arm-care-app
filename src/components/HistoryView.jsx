import { X } from 'lucide-react'

export default function HistoryView({ history, onClose }) {
    // Sort history by date (newest first)
    const sortedHistory = [...(history || [])].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                    <h2 className="text-lg font-bold text-white">Workout History</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-4 space-y-3">
                    {sortedHistory.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500">
                            <p>No completed workouts yet.</p>
                            <p className="text-sm mt-1">Finish a program to see it here!</p>
                        </div>
                    ) : (
                        sortedHistory.map((entry, idx) => (
                            <div key={idx} className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-red-500">{entry.program}</h3>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {new Date(entry.date).toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-white bg-neutral-800 px-2 py-1 rounded-md">
                                        {entry.completed} / {entry.total}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
