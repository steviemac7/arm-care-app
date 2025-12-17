import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { X, AlertTriangle } from 'lucide-react'

export default function DeleteUserModal({ userToDelete, onClose, onConfirm }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Re-authenticate admin
            const credential = EmailAuthProvider.credential(currentUser.email, password)
            await reauthenticateWithCredential(currentUser, credential)

            // If successful, confirm deletion
            await onConfirm(userToDelete.id)
            onClose()
        } catch (err) {
            console.error(err)
            setError('Incorrect password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-red-900 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-red-950/20">
                    <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Delete User Data
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-neutral-300 mb-6">
                        Are you sure you want to delete data for <span className="font-bold text-white">{userToDelete.email || userToDelete.id}</span>?
                        <br /><br />
                        <span className="text-red-400 text-sm">This action cannot be undone.</span>
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">
                                Confirm Admin Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
