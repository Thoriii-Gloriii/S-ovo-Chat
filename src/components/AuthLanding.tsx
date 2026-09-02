import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SovoLogo } from './SovoLogo';
import { User } from '../types';
import { CURRENT_USER } from '../data/mockInitialData';
import {
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  AtSign,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../lib/sound';

interface AuthLandingProps {
  onAuthenticate: (user: User) => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ onAuthenticate }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'social'>('phone');
  
  // Phone form state
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['7', '7', '8', '8', '', '']);
  
  // Email form state
  const [email, setEmail] = useState('aurelius.vance@sovo.private');
  const [password, setPassword] = useState('••••••••••••');
  
  // Username & Biometrics configuration
  const [username, setUsername] = useState('aurelius');
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    setErrorMsg('');
    sound.playTap();
    setOtpStep(true);
  };

  const handleOtpVerify = () => {
    setIsSubmitting(true);
    sound.playTap();
    setTimeout(() => {
      sound.playBiometricSuccess();
      const authenticatedUser: User = {
        ...CURRENT_USER,
        phoneNumber: phone,
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'aurelius',
        biometricEnabled: enableBiometrics,
      };
      onAuthenticate(authenticatedUser);
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter an email address');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    sound.playTap();
    setTimeout(() => {
      sound.playBiometricSuccess();
      const authenticatedUser: User = {
        ...CURRENT_USER,
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, '') || email.split('@')[0],
        biometricEnabled: enableBiometrics,
      };
      onAuthenticate(authenticatedUser);
    }, 600);
  };

  const handleSocialAuth = (provider: 'Google' | 'AndroidPasskey' | 'InstantDemo') => {
    setIsSubmitting(true);
    sound.playTap();
    setTimeout(() => {
      sound.playBiometricSuccess();
      const authenticatedUser: User = {
        ...CURRENT_USER,
        displayName: provider === 'AndroidPasskey' ? 'Android Verified Passkey' : CURRENT_USER.displayName,
        username: username || 'aurelius',
        biometricEnabled: enableBiometrics,
      };
      onAuthenticate(authenticatedUser);
    }, 700);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between bg-[#050507] text-[#f4f4f6] relative overflow-x-hidden selection:bg-[#d4af37]/30"
      id="sovo-auth-landing"
    >
      {/* Glossy Gold and Obsidian Ambient Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#c29826]/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-[#d4af37]/8 blur-[120px] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full px-6 py-6 flex items-center justify-between border-b border-[#202026]">
        <div className="flex items-center gap-3">
          <SovoLogo size="md" showText={true} withGlow={true} />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-[#d4af37] bg-[#121217] border border-[#d4af37]/30 px-3.5 py-1.5 rounded-full shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>E2EE 4096-bit</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-8 flex flex-col justify-center flex-grow">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-display font-bold text-gold-glossy tracking-tight mb-2">
            Private Access
          </h2>
          <p className="text-sm text-[#9ca3af] leading-relaxed">
            Communicate freely under custom @usernames with zero server data storage.
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0e0e13] border border-[#d4af37]/20 rounded-2xl mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              sound.playTap();
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              authMethod === 'phone'
                ? 'bg-gradient-to-b from-[#2a2414] to-[#17140b] text-[#ffd700] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#f3f4f6]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              sound.playTap();
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              authMethod === 'email'
                ? 'bg-gradient-to-b from-[#2a2414] to-[#17140b] text-[#ffd700] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#f3f4f6]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('social');
              sound.playTap();
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              authMethod === 'social'
                ? 'bg-gradient-to-b from-[#2a2414] to-[#17140b] text-[#ffd700] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#9ca3af] hover:text-[#f3f4f6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Card Body */}
        <div className="bg-[#0b0b0f] border border-[#26252b] rounded-3xl p-6 shadow-2xl relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-0.5 rounded-full bg-[#171510] border border-[#d4af37]/30 text-[10px] uppercase font-bold text-[#d4af37] tracking-widest shadow">
            Anonymity Shield
          </div>

          <AnimatePresence mode="wait">
            {/* Phone Authentication */}
            {authMethod === 'phone' && (
              <motion.div
                key="phone-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {!otpStep ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1.5">
                        Phone Number (for address book discovery)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-3 bg-[#13131a] border border-[#2e2d36] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm font-medium text-white placeholder-gray-500 outline-none transition"
                        />
                      </div>
                      <p className="text-[11px] text-[#848490] mt-1.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#d4af37]" /> S’ovo hashes this to match friends without ever revealing it.
                      </p>
                    </div>

                    {/* Anonymous S'ovo Username */}
                    <div>
                      <label className="block text-xs font-medium text-[#d1d5db] mb-1.5">
                        Your Unique S'ovo @Username
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="your_handle"
                          className="w-full pl-10 pr-4 py-3 bg-[#13131a] border border-[#2e2d36] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm font-medium text-white placeholder-gray-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl font-display font-semibold text-sm text-[#050507] gold-glossy-button flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                    >
                      <span>Send Encrypted SMS Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="inline-flex p-2.5 rounded-full bg-[#18160f] border border-[#d4af37]/30 text-[#ffd700] mb-2">
                        <KeyRound className="w-5 h-5" />
                      </span>
                      <h4 className="text-base font-semibold text-white">Enter 6-Digit Code</h4>
                      <p className="text-xs text-[#9ca3af] mt-0.5">
                        Sent to <span className="text-[#ffd700] font-mono">{phone}</span>
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 my-4">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otpCode];
                            newOtp[idx] = e.target.value;
                            setOtpCode(newOtp);
                          }}
                          className="w-11 h-12 text-center text-lg font-bold font-mono bg-[#14141d] border border-[#302f3c] focus:border-[#ffd700] text-[#ffd700] rounded-xl outline-none"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleOtpVerify}
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl font-display font-semibold text-sm text-[#050507] gold-glossy-button flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify & Enter Dashboard</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="w-full text-center text-xs text-[#9ca3af] hover:text-[#d4af37] transition"
                    >
                      Change phone number
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Email Authentication */}
            {authMethod === 'email' && (
              <motion.form
                key="email-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleEmailSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-[#d1d5db] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#13131a] border border-[#2e2d36] focus:border-[#d4af37] rounded-xl text-sm font-medium text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d1d5db] mb-1.5">
                    Security Passphrase / Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#13131a] border border-[#2e2d36] focus:border-[#d4af37] rounded-xl text-sm font-medium text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d1d5db] mb-1.5">
                    Your S'ovo @Username
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="aurelius"
                      className="w-full pl-10 pr-4 py-3 bg-[#13131a] border border-[#2e2d36] focus:border-[#d4af37] rounded-xl text-sm font-medium text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-display font-semibold text-sm text-[#050507] gold-glossy-button flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Authenticate with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* Social Authentication (Google & Apple ID) */}
            {authMethod === 'social' && (
              <motion.div
                key="social-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#14141c] hover:bg-[#1a1a24] border border-[#2d2c38] hover:border-[#d4af37]/50 flex items-center justify-center gap-3 text-sm font-semibold text-white transition active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Android Passkey / Knox Sign-in */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('AndroidPasskey')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#000000] hover:bg-[#111115] border border-[#d4af37]/40 hover:border-[#ffd700] flex items-center justify-center gap-3 text-sm font-semibold text-white transition active:scale-[0.99] cursor-pointer shadow-md"
                >
                  <Fingerprint className="w-4 h-4 text-[#ffd700]" />
                  <span>Sign in with Android Passkey</span>
                </button>

                {/* Instant Private Demo Session */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('InstantDemo')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2c2310] via-[#1a170e] to-[#2c2310] border border-[#d4af37]/60 hover:border-[#ffd700] flex items-center justify-center gap-2 text-sm font-semibold text-[#ffd700] transition active:scale-[0.99] cursor-pointer shadow-lg mt-4"
                >
                  <KeyRound className="w-4 h-4 text-[#ffd700]" />
                  <span>Instant Private Session (Demo Access)</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Biometric Toggle Setting */}
          <div className="mt-6 pt-5 border-t border-[#202028] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#171510] border border-[#d4af37]/30 text-[#ffd700]">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Biometric Lock</p>
                <p className="text-[10px] text-[#8e8e99]">Fingerprint / Face Unlock</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnableBiometrics(!enableBiometrics)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                enableBiometrics ? 'bg-[#d4af37]' : 'bg-[#272733]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  enableBiometrics ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-[11px] text-[#6b7280]">
        <p>S'ovo uses client-side zero-knowledge encryption for chats, statuses, and 2GB files.</p>
      </footer>
    </div>
  );
};
