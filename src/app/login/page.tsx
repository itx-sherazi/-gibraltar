'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getTranslations, isRTL, Language, Translations } from '@/lib/translations';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [lang, setLang] = useState<Language>('ar');
  const [t, setT] = useState<Translations>(getTranslations('ar'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang && ['ar', 'en', 'fr'].includes(savedLang)) {
      setLang(savedLang);
      setT(getTranslations(savedLang));
      document.documentElement.lang = savedLang;
      document.documentElement.dir = isRTL(savedLang) ? 'rtl' : 'ltr';
    }
    fetch('/api/init');
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setT(getTranslations(newLang));
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = isRTL(newLang) ? 'rtl' : 'ltr';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t.invalid_credentials);
    } else {
      router.push('/');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-white">
        <div className="custom-loader"></div>
      </div>
    );
  }

  return (
    <div className={`login-wrapper min-vh-100 d-flex ${isRTL(lang) ? 'flex-row-reverse rtl' : ''}`}>
      
      {/* Visual Side (Hidden on Mobile) */}
      <div className="login-visual d-none d-lg-flex flex-column justify-content-between p-5 text-white">
        <div className="brand-header animate-slide-down">
          <div className="d-flex align-items-center gap-3">
             <div className="logo-icon">
                <i className="bi bi-shield-check-fill fs-2"></i>
             </div>
             <h3 className="fw-800 mb-0 tracking-tight">{t.app_name}</h3>
          </div>
        </div>
        
        <div className="quote-section animate-fade-in delay-300">
          <h1 className="display-3 fw-800 mb-4 lh-1">Manage your fleet <br/><span className="text-accent-glow">with precision.</span></h1>
          <p className="lead opacity-75 max-w-sm">The most advanced car rental management system designed for scale and efficiency.</p>
        </div>

        <div className="visual-footer d-flex gap-4 animate-slide-up delay-500">
           <div className="stat-mini">
              <h4 className="fw-bold mb-0">100%</h4>
              <small className="opacity-50">Secure</small>
           </div>
           <div className="stat-mini border-start ps-4">
              <h4 className="fw-bold mb-0">24/7</h4>
              <small className="opacity-50">Real-time</small>
           </div>
        </div>
        
        {/* Background Image with Overlay */}
        <div className="visual-bg-overlay"></div>
        <img src="/login-bg.png" alt="Premium Car" className="visual-image" />
      </div>

      {/* Form Side */}
      <div className="login-form-container d-flex flex-column align-items-center justify-content-center">
        <div className="form-card animate-premium-in">
          
          <div className="d-lg-none text-center mb-5">
             <div className="mobile-logo mx-auto mb-3">
                <i className="bi bi-shield-check-fill fs-1"></i>
             </div>
             <h2 className="fw-900 tracking-tight">{t.app_name}</h2>
          </div>

          <div className="mb-5 text-center text-lg-start">
             <h2 className="fw-800 mb-2">{t.login}</h2>
             <p className="text-muted">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="alert-custom mb-4 animate-shake">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-100">
            <div className="input-group-premium mb-4">
              <label htmlFor="username">{t.username}</label>
              <div className="input-wrapper">
                 <i className="bi bi-person-fill"></i>
                 <input
                  type="text"
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="input-group-premium mb-5">
              <label htmlFor="password">{t.password}</label>
              <div className="input-wrapper">
                 <i className="bi bi-lock-fill"></i>
                 <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-login-premium mb-4"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm me-2"></div>
              ) : (
                <>
                  <span>{t.login_btn}</span>
                  <i className={`bi ${isRTL(lang) ? 'bi-arrow-left' : 'bi-arrow-right'} ms-2`}></i>
                </>
              )}
            </button>
          </form>

          <div className="language-selector-section pt-4 border-top">
             <p className="text-center text-muted small fw-bold text-uppercase tracking-widest mb-3">{t.language}</p>
             <div className="d-flex justify-content-center gap-2">
                {['ar', 'en', 'fr'].map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l as Language)}
                    className={`lang-btn ${lang === l ? 'active' : ''}`}
                  >
                    {t[l === 'ar' ? 'arabic' : l === 'en' ? 'english' : 'french']}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="footer-credits mt-5 text-muted small opacity-50">
           &copy; {new Date().getFullYear()} {t.app_name}. All rights reserved.
        </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          background-color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Visual Side Styles */
        .login-visual {
          width: 55%;
          position: relative;
          overflow: hidden;
          z-index: 10;
        }

        .visual-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
          transition: transform 10s ease;
        }

        .login-visual:hover .visual-image {
          transform: scale(1.1);
        }

        .visual-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%);
          z-index: -1;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: var(--grad-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .text-accent-glow {
          color: #a855f7;
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
        }

        /* Form Side Styles */
        .login-form-container {
          width: 45%;
          padding: 4rem;
          background: #f8fafc;
        }

        @media (max-width: 991px) {
          .login-form-container { width: 100%; padding: 2rem; }
          .form-card { width: 100%; max-width: 450px; }
        }

        .form-card {
          width: 100%;
          max-width: 420px;
        }

        .mobile-logo {
          width: 80px;
          height: 80px;
          background: var(--grad-primary);
          color: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.2);
        }

        /* Input Styles */
        .input-group-premium label {
          display: block;
          font-weight: 700;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper i {
          position: absolute;
          left: 1.25rem;
          color: #94a3b8;
          font-size: 1.2rem;
          transition: color 0.3s;
        }

        .rtl .input-wrapper i {
          left: auto;
          right: 1.25rem;
        }

        .input-wrapper input {
          width: 100%;
          padding: 1.1rem 1.1rem 1.1rem 3.5rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .rtl .input-wrapper input {
          padding: 1.1rem 3.5rem 1.1rem 1.1rem;
        }

        .input-wrapper input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.1);
        }

        .input-wrapper input:focus + i {
          color: #6366f1;
        }

        /* Button & UI Components */
        .btn-login-premium {
          width: 100%;
          padding: 1.1rem;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .btn-login-premium:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .alert-custom {
          padding: 1rem 1.25rem;
          background: #fef2f2;
          border-right: 4px solid #ef4444;
          color: #b91c1c;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .rtl .alert-custom {
          border-right: none;
          border-left: 4px solid #ef4444;
        }

        .lang-btn {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s;
        }

        .lang-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .lang-btn.active {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }

        /* Animations */
        @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-slide-down { animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 1s ease forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }

        .custom-loader {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .max-w-sm { max-width: 400px; }
        .fw-900 { font-weight: 900; }
        .fw-800 { font-weight: 800; }
        .tracking-widest { letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}
