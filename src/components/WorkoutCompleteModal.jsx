import { useState } from 'react'
import { Save, X } from 'lucide-react'

export default function WorkoutCompleteModal({ stats, onSave, onCancel }) {
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        await onSave(comment)
        setSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-green-950/20">
                    <h2 className="text-lg font-bold text-green-500 flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Workout Complete!
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Stats Summary */}
                    <div className="bg-neutral-950/50 rounded-lg p-4 border border-neutral-800 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Exercises</p>
                                <p className="text-xl font-bold text-white">{stats.completed}/{stats.total}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Duration</p>
                                <p className="text-xl font-bold text-white">{stats.timeStr}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">
                                Add a message (optional)
                            </label>
                            <textarea
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-green-600 transition-colors h-24 resize-none"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="How did it feel? (Max 25 chars)"
                                maxLength={25}
                            />
                            <div className="text-right text-xs text-neutral-600 mt-1">
                                {comment.length}/25
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : 'Save Workout'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
