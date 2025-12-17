import { AlertTriangle, ShieldCheck } from 'lucide-react'

export default function SafetyWarningModal({ onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-red-900/50 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-red-900/30 bg-red-950/20 flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Safety First</h2>
                        <p className="text-red-400 text-sm font-medium">Please read carefully before proceeding</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">

                    <div className="space-y-4">
                        <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800">
                            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                <span className="bg-red-500/10 px-2 py-0.5 rounded text-xs">WARNING 1</span>
                            </h3>
                            <p className="text-neutral-300 leading-relaxed">
                                Always be sure the J-band anchor is firmly attached to the anchor point so that it cannot easily slip off.
                            </p>
                        </div>

                        <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800">
                            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                <span className="bg-red-500/10 px-2 py-0.5 rounded text-xs">WARNING 2</span>
                            </h3>
                            <p className="text-neutral-300 leading-relaxed">
                                <span className="text-white font-bold">DO NOT</span> attach the anchor point at eye-level. Only attach at shoulder level or below.
                            </p>
                        </div>

                        <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800">
                            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                <span className="bg-red-500/10 px-2 py-0.5 rounded text-xs">WARNING 3</span>
                            </h3>
                            <p className="text-neutral-300 leading-relaxed">
                                When doing exercises that require you to face the anchor point, <span className="text-white font-bold">do not look at the anchor point</span>. This will prevent you from being hit in the eye in the event of band failure.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-800 bg-neutral-900">
                    <button
                        onClick={onConfirm}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-900/20"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        I Understand & Start Workout
                    </button>
                </div>
            </div>
        </div>
    )
}
