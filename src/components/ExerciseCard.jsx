import { PlayCircle, Clock, Repeat, CheckCircle2, Circle } from 'lucide-react'

export default function ExerciseCard({ exercise, onPlayVideo, isCompleted, onToggle }) {
    const hasVideo = exercise.video && exercise.video !== 'None'

    return (
        <div
            className={`
                rounded-xl p-4 border transition-all duration-200 group relative overflow-hidden
                ${isCompleted
                    ? 'bg-neutral-900/50 border-red-500/30'
                    : 'bg-neutral-900 border-neutral-800 hover:border-red-500/50'
                }
            `}
        >
            {/* Progress Background Fill */}
            <div
                className={`absolute inset-0 bg-red-600/10 transition-transform duration-500 ease-out origin-left ${isCompleted ? 'scale-x-100' : 'scale-x-0'
                    }`}
            />

            <div className="relative flex justify-between items-start gap-4">
                <div className="flex-1 flex gap-3">
                    {/* Checkbox */}
                    <button
                        onClick={onToggle}
                        className={`mt-1 transition-colors ${isCompleted ? 'text-red-500' : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <Circle className="w-5 h-5" />
                        )}
                    </button>

                    <div>
                        <h4 className={`font-medium transition-colors ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-200 group-hover:text-red-400'
                            }`}>
                            {exercise.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                            <div className="flex items-center gap-1">
                                {exercise.reps && (exercise.reps.includes('sec') || exercise.reps.includes('min')) ? (
                                    <Clock className="w-3 h-3" />
                                ) : (
                                    <Repeat className="w-3 h-3" />
                                )}
                                <span>{exercise.reps || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {hasVideo && (
                    <button
                        onClick={() => onPlayVideo(exercise.video, exercise.timestamp)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                        title="Watch Video"
                    >
                        <PlayCircle className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    )
}
