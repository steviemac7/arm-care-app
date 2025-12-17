import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { ArrowLeft, User, Trash2 } from 'lucide-react'
import DeleteUserModal from './DeleteUserModal'

export default function AdminDashboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [userToDelete, setUserToDelete] = useState(null)

    const handleDeleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId))
            setUsers(users.filter(user => user.id !== userId))
        } catch (error) {
            console.error("Error deleting user:", error)
            alert("Failed to delete user data.")
        }
    }

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
                            <div key={user.id} className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 relative group">
                                <button
                                    onClick={() => setUserToDelete(user)}
                                    className="absolute top-4 right-4 p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete User Data"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
                                    <div className="bg-neutral-800 p-2 rounded-full">
                                        <User className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg text-white">
                                            {user.email || `User ID: ${user.id}`}
                                        </h2>
                                        {user.email && (
                                            <p className="text-xs text-neutral-500">ID: {user.id}</p>
                                        )}
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
                                                    <div className="flex flex-col items-end">
                                                        <span>{entry.completed}/{entry.total}</span>
                                                        {entry.duration !== undefined && (
                                                            <span className="text-xs text-neutral-600">
                                                                {Math.floor(entry.duration / 60)}m {entry.duration % 60}s
                                                            </span>
                                                        )}
                                                    </div>
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

                {userToDelete && (
                    <DeleteUserModal
                        userToDelete={userToDelete}
                        onClose={() => setUserToDelete(null)}
                        onConfirm={handleDeleteUser}
                    />
                )}
            </div>
        </div>
    )
}
