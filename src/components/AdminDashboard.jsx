import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'

export default function AdminDashboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"))
                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setUsers(usersData)
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Admin Dashboard
                    </h1>
                </header>

                {loading ? (
                    <div className="text-center py-12 text-neutral-500">Loading users...</div>
                ) : (
                    <div className="grid gap-6">
                        {users.map(user => (
                            <div key={user.id} className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
                                    <div className="bg-neutral-800 p-2 rounded-full">
                                        <User className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg text-white">User ID: {user.id}</h2>
                                        {/* Note: We can't get email directly from Firestore unless we saved it there. 
                                            If we didn't save email in the user doc, we only have the ID. 
                                            For this implementation, we'll display the ID. */}
                                    </div>
                                </div>

                                <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">Recent History</h3>
                                <div className="space-y-2">
                                    {user.history && user.history.length > 0 ? (
                                        user.history.slice().reverse().slice(0, 5).map((entry, idx) => (
                                            <div key={idx} className="flex justify-between text-sm bg-neutral-950/30 p-2 rounded border border-neutral-800/50">
                                                <span className="text-neutral-300">{entry.program}</span>
                                                <div className="flex gap-4 text-neutral-500">
                                                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                                                    <span>{entry.completed}/{entry.total}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-neutral-600 italic">No history recorded.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
