import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal } from 'lucide-react'

export default function Leaderboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"))
                const leaderboardData = []

                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    // Only include users who have at least one workout
                    const history = data.history || []

                    let avgDuration = 0
                    let minDuration = 0
                    let maxDuration = 0

                    if (history.length > 0) {
                        const totalDuration = history.reduce((acc, curr) => acc + (curr.duration || 0), 0)
                        avgDuration = Math.round(totalDuration / history.length)
                        const times = history.map(h => h.duration || 0)
                        minDuration = Math.min(...times)
                        maxDuration = Math.max(...times)
                    }

                    leaderboardData.push({
                        id: doc.id,
                        username: data.email ? data.email.split('@')[0] : 'Anonymous',
                        count: history.length,
                        lastWorkout: history.length > 0 ? history[history.length - 1]?.date : null,
                        avgTime: avgDuration,
                        minTime: minDuration,
                        maxTime: maxDuration
                    })
                })

                // Sort by count (descending)
                leaderboardData.sort((a, b) => b.count - a.count)
                setUsers(leaderboardData)
            } catch (error) {
                console.error("Error fetching leaderboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />
        if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />
        if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />
        return <span className="text-neutral-500 font-mono w-5 text-center">{index + 1}</span>
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link
                        to="/"
                        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Trophy className="w-8 h-8 text-red-600" />
                            Leaderboard
                        </h1>
                        <p className="text-neutral-400">Top performers by completed workouts</p>
                    </div>
                </header>

                <div className="bg-neutral-900/50 rounded-2xl overflow-hidden shadow-xl border border-neutral-800 backdrop-blur-sm">
                    {loading ? (
                        <div className="p-8 text-center text-neutral-500">Loading rankings...</div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">No users found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 text-sm uppercase tracking-wider whitespace-nowrap">
                                        <th className="p-4 font-medium w-16 text-center">Rank</th>
                                        <th className="p-4 font-medium">Athlete</th>
                                        <th className="p-4 font-medium text-right">Workouts</th>
                                        <th className="p-4 font-medium text-right">Avg Time</th>
                                        <th className="p-4 font-medium text-right">Min Time</th>
                                        <th className="p-4 font-medium text-right">Max Time</th>
                                        <th className="p-4 font-medium text-right">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {users.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 text-center flex justify-center items-center">
                                                {getRankIcon(index)}
                                            </td>
                                            <td className="p-4 font-medium text-white">
                                                {user.username}
                                                {index === 0 && <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">Leader</span>}
                                            </td>
                                            <td className="p-4 text-right font-bold text-red-500 text-lg">
                                                {user.count}
                                            </td>
                                            <td className="p-4 text-right text-sm text-neutral-300">
                                                {Math.floor(user.avgTime / 60)}m {user.avgTime % 60}s
                                            </td>
                                            <td className="p-4 text-right text-sm text-neutral-400">
                                                {Math.floor(user.minTime / 60)}m {user.minTime % 60}s
                                            </td>
                                            <td className="p-4 text-right text-sm text-neutral-400">
                                                {Math.floor(user.maxTime / 60)}m {user.maxTime % 60}s
                                            </td>
                                            <td className="p-4 text-right text-sm text-neutral-500">
                                                {user.lastWorkout ? new Date(user.lastWorkout).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
