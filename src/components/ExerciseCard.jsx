import { useState, useEffect } from 'react'
import { PlayCircle, Clock, Repeat, CheckCircle2, Circle, Play, Pause, RotateCcw } from 'lucide-react'

export default function ExerciseCard({ exercise, onPlayVideo, isCompleted, onToggle }) {
    const hasVideo = exercise.video && exercise.video !== 'None'

    // Timer Logic
    const [duration, setDuration] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [isActive, setIsActive] = useState(false)

    const playPing = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type = "sine"
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)

        osc.start()
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5)
        osc.stop(ctx.currentTime + 0.5)
    }

    useEffect(() => {
        if (exercise.reps) {
            const reps = exercise.reps.toLowerCase()
            let time = 0

            if (reps.includes('sec')) {
                time = parseInt(reps)
            } else if (reps.includes('min')) {
                time = parseInt(reps) * 60
            }

            if (time > 0) {
                setDuration(time)
                setTimeLeft(time)
            }
        }
    }, [exercise.reps])

    useEffect(() => {
        let interval = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false)
            playPing()
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(duration)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const isTimeBased = duration > 0

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

                    <div className="flex-1">
                        <h4 className={`font-medium transition-colors ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-200 group-hover:text-red-400'
                            }`}>
                            {exercise.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-400">
                            <div className="flex items-center gap-1">
                                {isTimeBased ? (
                                    <Clock className="w-3 h-3" />
                                ) : (
                                    <Repeat className="w-3 h-3" />
                                )}
                                <span>{exercise.reps || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Timer UI */}
                        {isTimeBased && !isCompleted && (
                            <div className="mt-3 flex items-center gap-3 bg-neutral-950/50 p-2 rounded-lg border border-neutral-800 w-fit">
                                <span className={`font-mono text-lg font-bold ${timeLeft === 0 ? 'text-red-500' : 'text-white'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={toggleTimer}
                                        className="p-1.5 rounded-full bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-400 transition-colors"
                                    >
                                        {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
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
