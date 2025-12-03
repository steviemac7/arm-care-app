import { useState, useEffect, useMemo } from 'react'
import { programs } from './data/exercises'
import ProgramView from './components/ProgramView'
import VideoModal from './components/VideoModal'
import logo from './assets/logo.jpg'
import completionSound from './assets/completion.m4a'

function App() {
  const [activeTab, setActiveTab] = useState(programs[0].name)
  const [videoState, setVideoState] = useState(null)

  // Load saved progress from localStorage
  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem('armCareProgress')
    return saved ? JSON.parse(saved) : {}
  })

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('armCareProgress', JSON.stringify(completedExercises))
  }, [completedExercises])

  const activeProgram = programs.find(p => p.name === activeTab)

  const handlePlayVideo = (url, timestamp) => {
    setVideoState({ url, timestamp })
  }

  const toggleExercise = (exerciseName) => {
    // Calculate new state locally to check for completion immediately
    const prevProgramState = completedExercises[activeTab] || {}
    const isNowCompleted = !prevProgramState[exerciseName]
    const newProgramState = { ...prevProgramState, [exerciseName]: isNowCompleted }

    // Check completion
    let total = 0
    let completedCount = 0

    activeProgram.sections.forEach(section => {
      section.subSections.forEach(sub => {
        sub.exercises.forEach(ex => {
          total++
          if (ex.name === exerciseName ? isNowCompleted : prevProgramState[ex.name]) {
            completedCount++
          }
        })
      })
    })

    // Play sound if all completed
    if (completedCount === total && total > 0) {
      const audio = new Audio(completionSound)
      audio.play().catch(e => console.error('Audio play failed:', e))
    }

    // Update state
    setCompletedExercises(prev => ({
      ...prev,
      [activeTab]: newProgramState
    }))
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
        <header className="mb-8 text-center">
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
              {progressStats.completed > 0 && (
                <button
                  onClick={() => setCompletedExercises(prev => ({ ...prev, [activeTab]: {} }))}
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
    </div>
  )
}

export default App
