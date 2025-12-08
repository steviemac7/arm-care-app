import { useState, useEffect, useMemo } from 'react'
import { programs } from '../data/exercises'
import ProgramView from './ProgramView'
import VideoModal from './VideoModal'
import HistoryView from './HistoryView'
import logo from '../assets/logo.jpg'

import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { doc, setDoc, onSnapshot, arrayUnion } from 'firebase/firestore'
import { History } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(programs[0].name)
    const [videoState, setVideoState] = useState(null)
    const [completedExercises, setCompletedExercises] = useState({})
    const [history, setHistory] = useState([])
    const [showHistory, setShowHistory] = useState(false)
    const [sessionData, setSessionData] = useState({ startTime: null, lastActivity: null })
    const { currentUser, logout } = useAuth()

    // Load progress and history from Firestore
    useEffect(() => {
        if (!currentUser) return

        const userDocRef = doc(db, 'users', currentUser.uid)

        // Sync email to Firestore
        setDoc(userDocRef, { email: currentUser.email }, { merge: true })

        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data()
                setCompletedExercises(data.currentProgress || {})
                setHistory(data.history || [])
                setSessionData(data.currentSession || { startTime: null, lastActivity: null })
            }
        })

        return unsubscribe
    }, [currentUser])

    // Helper to save progress to Firestore
    const saveProgress = async (newProgress, newSessionData = null) => {
        if (!currentUser) return
        try {
            const userDocRef = doc(db, 'users', currentUser.uid)
            const updateData = { currentProgress: newProgress }
            if (newSessionData) {
                updateData.currentSession = newSessionData
            }
            await setDoc(userDocRef, updateData, { merge: true })
        } catch (error) {
            console.error("Error saving progress:", error)
        }
    }

    const activeProgram = programs.find(p => p.name === activeTab)

    const handlePlayVideo = (url, timestamp) => {
        setVideoState({ url, timestamp })
    }

    const toggleExercise = async (exerciseName) => {
        // Calculate new state locally
        const prevProgramState = completedExercises[activeTab] || {}
        const isNowCompleted = !prevProgramState[exerciseName]
        const newProgramState = { ...prevProgramState, [exerciseName]: isNowCompleted }

        // Update local state immediately
        const newCompletedExercises = {
            ...completedExercises,
            [activeTab]: newProgramState
        }
        setCompletedExercises(newCompletedExercises)

        // Update session timing
        const now = Date.now()
        const newSessionData = {
            startTime: sessionData.startTime || now,
            lastActivity: now
        }
        setSessionData(newSessionData)

        // Save to Firestore
        saveProgress(newCompletedExercises, newSessionData)
    }

    const toggleExerciseGroup = async (exerciseNames) => {
        // Calculate new state locally
        const prevProgramState = completedExercises[activeTab] || {}

        // Check if all are currently completed
        const allCompleted = exerciseNames.every(name => prevProgramState[name])
        const targetState = !allCompleted

        // Create new state updates
        const updates = {}
        exerciseNames.forEach(name => {
            updates[name] = targetState
        })

        const newProgramState = { ...prevProgramState, ...updates }

        // Update local state immediately
        const newCompletedExercises = {
            ...completedExercises,
            [activeTab]: newProgramState
        }
        setCompletedExercises(newCompletedExercises)

        // Update session timing
        const now = Date.now()
        const newSessionData = {
            startTime: sessionData.startTime || now,
            lastActivity: now
        }
        setSessionData(newSessionData)

        // Save to Firestore
        saveProgress(newCompletedExercises, newSessionData)
    }

    const finishWorkout = async () => {
        if (!activeProgram) return

        let total = 0
        let completedCount = 0

        activeProgram.sections.forEach(section => {
            section.subSections.forEach(sub => {
                sub.exercises.forEach(ex => {
                    total++
                    if (completedExercises[activeTab]?.[ex.name]) {
                        completedCount++
                    }
                })
            })
        })

        if (completedCount > 0) {

            if (currentUser) {
                try {
                    // Calculate duration
                    let durationSeconds = 0
                    if (sessionData.startTime && sessionData.lastActivity) {
                        durationSeconds = Math.round((sessionData.lastActivity - sessionData.startTime) / 1000)
                    }

                    const userDocRef = doc(db, 'users', currentUser.uid)
                    await setDoc(userDocRef, {
                        history: arrayUnion({
                            date: new Date().toISOString(),
                            program: activeTab,
                            completed: completedCount,
                            total: total,
                            duration: durationSeconds
                        }),
                        currentSession: { startTime: null, lastActivity: null } // Reset session
                    }, { merge: true })

                    // Optional: Show feedback
                    const mins = Math.floor(durationSeconds / 60)
                    const secs = durationSeconds % 60
                    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

                    alert(`Workout saved! ${completedCount}/${total} exercises completed in ${timeStr}.`)
                } catch (error) {
                    console.error("Error saving history:", error)
                    alert("Failed to save workout. Please try again.")
                }
            }
        } else {
            alert("No exercises completed yet!")
        }
    }

    const handleReset = () => {
        const newCompletedExercises = { ...completedExercises, [activeTab]: {} }
        setCompletedExercises(newCompletedExercises)
        setSessionData({ startTime: null, lastActivity: null })
        saveProgress(newCompletedExercises, { startTime: null, lastActivity: null })
    }

    // Calculate progress stats
    const progressStats = useMemo(() => {
        if (!activeProgram) return { total: 0, completed: 0, percent: 0 }

        let total = 0
        let completed = 0

        activeProgram.sections.forEach(section => {
            section.subSections.forEach(sub => {
                sub.exercises.forEach(ex => {
                    total++
                    if (completedExercises[activeTab]?.[ex.name]) {
                        completed++
                    }
                })
            })
        })

        return {
            total,
            completed,
            percent: total === 0 ? 0 : Math.round((completed / total) * 100)
        }
    }, [activeProgram, completedExercises, activeTab])

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 p-4 md:p-8 font-sans pb-24">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center relative">
                    <div className="absolute right-0 top-0 flex items-center gap-4">
                        {currentUser?.email === 'stvmcdnld@gmail.com' && (
                            <Link
                                to="/admin"
                                className="text-xs text-red-500 hover:text-red-400 transition-colors font-bold"
                            >
                                Admin Panel
                            </Link>
                        )}
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-xs text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <History className="w-3 h-3" />
                            History
                        </button>
                        <button
                            onClick={logout}
                            className="text-xs text-neutral-500 hover:text-red-500 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <img
                            src={logo}
                            alt="Arm Care Pro Logo"
                            className="w-16 h-16 rounded-full border-2 border-red-600/50 shadow-lg shadow-red-900/20"
                        />
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Arm Care Pro
                        </h1>
                    </div>
                    <p className="text-neutral-400">Select your workout program below</p>
                </header>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {programs.map((program) => (
                        <button
                            key={program.name}
                            onClick={() => setActiveTab(program.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === program.name
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                                }`}
                        >
                            {program.name}
                        </button>
                    ))}
                </div>

                {/* Progress Bar (Sticky Top) */}
                <div className="sticky top-4 z-40 mb-6 bg-neutral-950/90 backdrop-blur-md p-4 rounded-xl border border-neutral-800 shadow-xl">
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-red-500">Progress</span>
                        <div className="flex items-center gap-4">
                            <span className="text-neutral-400">{progressStats.completed} / {progressStats.total} Completed</span>
                            <button
                                onClick={finishWorkout}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full transition-colors shadow-lg shadow-red-900/20"
                            >
                                Finish Workout
                            </button>
                            {progressStats.completed > 0 && (
                                <button
                                    onClick={handleReset}
                                    className="text-xs text-red-500 hover:text-red-400 underline transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="h-3 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out"
                            style={{ width: `${progressStats.percent}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-neutral-900/50 rounded-2xl p-6 shadow-xl border border-neutral-800 backdrop-blur-sm">
                    {activeProgram && (
                        <ProgramView
                            program={activeProgram}
                            onPlayVideo={handlePlayVideo}
                            completedExercises={completedExercises[activeTab] || {}}
                            onToggleExercise={toggleExercise}
                            onToggleGroup={toggleExerciseGroup}
                        />
                    )}
                </div>
            </div>

            {/* Video Modal */}
            {videoState && (
                <VideoModal
                    videoUrl={videoState.url}
                    timestamp={videoState.timestamp}
                    onClose={() => setVideoState(null)}
                />
            )}

            {/* History Modal */}
            {showHistory && (
                <HistoryView
                    history={history}
                    onClose={() => setShowHistory(false)}
                />
            )}
        </div>
    )
}
