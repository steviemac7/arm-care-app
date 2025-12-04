import { X, Play, Pause, RotateCcw } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function ExpandedTimerModal({
    timeLeft,
    isActive,
    totalTime,
    exerciseName,
    onToggle,
    onReset,
    onClose
}) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center space-y-8">
                    <h2 className="text-2xl font-bold text-white">{exerciseName}</h2>

                    {/* Timer Display */}
                    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                        {/* Progress Ring Background */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-neutral-800"
                            />
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                className="text-red-600 transition-all duration-1000 ease-linear"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="text-7xl font-mono font-bold text-white tracking-tighter">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={onToggle}
                            className={`p-6 rounded-full transition-all transform hover:scale-105 ${isActive
                                ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                                : 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50'
                                }`}
                        >
                            {isActive ? (
                                <Pause className="w-8 h-8 fill-current" />
                            ) : (
                                <Play className="w-8 h-8 fill-current ml-1" />
                            )}
                        </button>

                        <button
                            onClick={onReset}
                            className="p-6 rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                            <RotateCcw className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
