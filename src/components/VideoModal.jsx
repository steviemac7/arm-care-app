import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function VideoModal({ videoUrl, timestamp, onClose }) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // Extract video ID from URL
    const getEmbedUrl = (url, startTime) => {
        try {
            let videoId = ''
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0]
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0]
            }

            if (!videoId) return null

            let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`
            if (startTime) {
                // Ensure timestamp is an integer
                const startSeconds = Math.floor(parseFloat(startTime))
                embedUrl += `&start=${startSeconds}`
            }

            return embedUrl
        } catch (e) {
            return null
        }
    }

    const embedUrl = getEmbedUrl(videoUrl, timestamp)

    if (!embedUrl) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-medium text-slate-200">Exercise Video</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Video Container */}
                <div className="relative pt-[56.25%] bg-black">
                    <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Exercise Video"
                    />
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    )
}
