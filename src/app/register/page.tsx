'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'user' | 'neuroscientist'>('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '', // For neuroscientists
    institution: '', // For neuroscientists
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (userType === 'neuroscientist' && !formData.licenseNumber) {
      setError('License number is required for neuroscientists');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          licenseNumber: userType === 'neuroscientist' ? formData.licenseNumber : undefined,
          institution: userType === 'neuroscientist' ? formData.institution : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Neural Background Animation */}
      <div className="absolute inset-0 neural-bg opacity-30"></div>
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="var(--primary)" opacity="0.2" />
            </pattern>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="50%" stopColor="var(--wave)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
          
          {/* Animated Neural Connections */}
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1={`${10 + i * 12}%`}
              y1="0%"
              x2={`${15 + i * 12}%`}
              y2="100%"
              stroke="url(#wave-gradient)"
              strokeWidth="1"
              opacity="0.15"
              animate={{
                x1: [`${10 + i * 12}%`, `${12 + i * 12}%`, `${10 + i * 12}%`],
                x2: [`${15 + i * 12}%`, `${13 + i * 12}%`, `${15 + i * 12}%`],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: [0.42, 0, 0.58, 1] as const,
                  }}
                />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-[var(--foreground)]/60 mt-2">
              Join the neural harmony community
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--primary)]/20 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {success ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Account Created!</h3>
                <p className="text-[var(--foreground)]/60">Redirecting to login...</p>
              </motion.div>
            ) : (
              <>
                {/* User Type Selector */}
                <div className="flex gap-2 mb-6 p-1 bg-[var(--background)]/50 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setUserType('user')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                      userType === 'user'
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg'
                        : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
                    }`}
                  >
                    General User
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('neuroscientist')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                      userType === 'neuroscientist'
                        ? 'bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] text-white shadow-lg'
                        : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
                    }`}
                  >
                    Neuroscientist
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Neuroscientist-specific Fields */}
                  {userType === 'neuroscientist' && (
                    <motion.div
                      className="space-y-5"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div>
                        <label htmlFor="licenseNumber" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Medical License Number
                        </label>
                        <input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          required={userType === 'neurologist'}
                          className="w-full px-4 py-3 bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                          placeholder="License #"
                        />
                      </div>

                      <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Institution / Hospital
                        </label>
                        <input
                          id="institution"
                          name="institution"
                          type="text"
                          value={formData.institution}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                          placeholder="Medical Center Name"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                      placeholder="At least 8 characters"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--background)]/50 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                      placeholder="Re-enter password"
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 mt-1 rounded border-[var(--primary)]/20 text-[var(--primary)] focus:ring-[var(--primary)]/20"
                    />
                    <span className="text-sm text-[var(--foreground)]/60">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[var(--primary)] hover:text-[var(--secondary)]">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-[var(--primary)] hover:text-[var(--secondary)]">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                      userType === 'user'
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:shadow-xl'
                        : 'bg-gradient-to-r from-[var(--wave)] to-[var(--accent)] hover:shadow-xl'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating account...</span>
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--foreground)]/60">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-[var(--primary)] hover:text-[var(--secondary)] font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-sm text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to home</span>
                  </Link>
                </div>
              </>
            )}
          </motion.div>

          {/* Security Badge */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 text-xs text-[var(--foreground)]/40">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure encrypted connection</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
