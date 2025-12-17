import { useState } from 'react'
import { User, X, Save } from 'lucide-react'

export default function NicknameModal({ currentNickname, onSave, onClose }) {
    const [nickname, setNickname] = useState(currentNickname || '')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        await onSave(nickname)
        setSubmitting(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" />
                        Edit Nickname
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                            Display Name (Leaderboard)
                        </label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="e.g. Speed Demon"
                            maxLength={20}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-600 transition-colors"
                            autoFocus
                        />
                        <p className="text-xs text-neutral-600 mt-2 text-right">
                            {nickname.length}/20
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Saving...' : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
