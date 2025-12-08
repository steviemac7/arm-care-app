import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { resetPassword } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(email)
            setMessage('Check your inbox for further instructions')
        } catch (err) {
            setError('Failed to reset password. Please check if the email is correct.')
            console.error(err)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-900 rounded-2xl p-8 shadow-xl border border-neutral-800">
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-red-600/50"
                    />
                    <h2 className="text-2xl font-bold text-white">Password Recovery</h2>
                    <p className="text-neutral-400 mt-2">Enter your email to reset your password</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    <Link to="/login" className="text-red-500 hover:text-red-400 font-medium">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
