import { useState, useEffect } from 'react'
import { PlayCircle, Clock, Repeat, CheckCircle2, Circle, Play, Pause, RotateCcw, Maximize2 } from 'lucide-react'
import ExpandedTimerModal from './ExpandedTimerModal'

export default function ExerciseCard({ exercise, onPlayVideo, isCompleted, onToggle }) {
    const hasVideo = exercise.video && exercise.video !== 'None'

    // Timer Logic
    const [duration, setDuration] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)

    const [isActive, setIsActive] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel() // Clear any pending speech
            const utterance = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterance)
            console.log("Speaking:", text)
        }
    }

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
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 2.0)
        osc.stop(ctx.currentTime + 2.0)
    }

    useEffect(() => {
        if (exercise.reps) {
            const reps = String(exercise.reps).toLowerCase()

            // Explicitly ignore distance-based exercises and reset state
            if (reps.includes('ft')) {
                setDuration(0)
                setTimeLeft(0)
                return
            }

            // Match number followed optionally by space and then sec/min
            // This handles "60 sec", "60sec", "2 min", "30 sec per side"
            const match = reps.match(/(\d+)\s*(sec|min)/)

            if (match) {
                const value = parseInt(match[1])
                const unit = match[2]
                let time = 0

                if (unit === 'sec') {
                    time = value
                } else if (unit === 'min') {
                    time = value * 60
                }

                if (time > 0) {
                    setDuration(time)
                    setTimeLeft(time)
                }
            } else {
                setDuration(0)
                setTimeLeft(0)
            }
        } else {
            setDuration(0)
            setTimeLeft(0)
        }
    }, [exercise.reps])

    useEffect(() => {
        let interval = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1

                    // Audio Feedback Logic
                    if (newTime > 5 && newTime % 10 === 0) {
                        speak(`${newTime} seconds`)
                    } else if (newTime <= 5 && newTime > 0) {
                        speak(newTime.toString())
                    } else if (newTime === 0) {
                        speak("Stop")
                    }

                    return newTime
                })
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false)
            playPing()
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => {
        if (!isActive) {
            setIsExpanded(true)
        }
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
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="font-mono text-lg font-bold hover:text-red-400 transition-colors text-left"
                                >
                                    <span className={timeLeft === 0 ? 'text-red-500' : 'text-white'}>
                                        {formatTime(timeLeft)}
                                    </span>
                                </button>
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
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 transition-colors ml-1"
                                    title="Expand Timer"
                                >
                                    <Maximize2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* Expanded Timer Modal */}
                        {isExpanded && (
                            <ExpandedTimerModal
                                timeLeft={timeLeft}
                                isActive={isActive}
                                totalTime={duration}
                                exerciseName={exercise.name}
                                onToggle={toggleTimer}
                                onReset={resetTimer}
                                onClose={() => setIsExpanded(false)}
                            />
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
