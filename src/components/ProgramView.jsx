import ExerciseCard from './ExerciseCard'
import { CheckCircle2, Circle } from 'lucide-react'

export default function ProgramView({ program, onPlayVideo, completedExercises, onToggleExercise, onToggleGroup }) {
    return (
        <div className="space-y-8">
            {program.sections.map((section, idx) => (
                <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <h2 className="text-xl font-bold text-red-500 mb-4 border-b border-neutral-800 pb-2">
                        {section.heading}
                    </h2>

                    <div className="space-y-6">
                        {section.subSections.map((sub, subIdx) => {
                            const isGroupCompleted = sub.exercises.every(ex => completedExercises[ex.name])

                            return (
                                <div key={subIdx}>
                                    <div className="flex items-center gap-3 mb-3 pl-2 border-l-2 border-red-600/50">
                                        <button
                                            onClick={() => onToggleGroup(sub.exercises.map(ex => ex.name))}
                                            className={`transition-colors ${isGroupCompleted ? 'text-red-500' : 'text-neutral-600 hover:text-neutral-400'}`}
                                            title={isGroupCompleted ? "Uncheck all" : "Check all"}
                                        >
                                            {isGroupCompleted ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <Circle className="w-5 h-5" />
                                            )}
                                        </button>
                                        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                                            {sub.subHeading}
                                        </h3>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                                        {sub.exercises.map((ex, exIdx) => (
                                            <ExerciseCard
                                                key={exIdx}
                                                exercise={ex}
                                                onPlayVideo={onPlayVideo}
                                                isCompleted={!!completedExercises[ex.name]}
                                                onToggle={() => onToggleExercise(ex.name)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
