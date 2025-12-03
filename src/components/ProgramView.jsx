import ExerciseCard from './ExerciseCard'

export default function ProgramView({ program, onPlayVideo, completedExercises, onToggleExercise }) {
    return (
        <div className="space-y-8">
            {program.sections.map((section, idx) => (
                <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <h2 className="text-xl font-bold text-blue-300 mb-4 border-b border-slate-700 pb-2">
                        {section.heading}
                    </h2>

                    <div className="space-y-6">
                        {section.subSections.map((sub, subIdx) => (
                            <div key={subIdx}>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-2 border-l-2 border-blue-500/50">
                                    {sub.subHeading}
                                </h3>
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
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
