import Link from "next/link"
import { ArrowRight, TrendingUp, Plane, BarChart3, Mail, Linkedin, Facebook, Instagram, Zap, Target, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-3xl text-slate-900">FINIX</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Financial Platform
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 text-balance leading-tight">
              Take Control of Your
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Finances</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 text-balance max-w-3xl mx-auto leading-relaxed">
              Track spending, split bills effortlessly, and get AI-powered insights. Your all-in-one financial companion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-200 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Complete financial control in one powerful platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Smart Analytics</h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time insights into your spending patterns with AI-powered recommendations tailored to your goals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Integrated Travel Planning</h3>
            <p className="text-slate-600 leading-relaxed">
              Connect your travel goals directly to your real-time budget. FINIX provides smart insights to help you save for your trip faster. Receive AI-powered recommendations to optimize your itinerary and costs.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Bill Splitting</h3>
            <p className="text-slate-600 leading-relaxed">
              Effortlessly split expenses with friends and settle debts automatically. FairShare makes it simple.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center space-y-8 shadow-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Manage Your Finances?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands using FINIX to take control of their money today. Start your journey to financial freedom.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-10 py-4 rounded-lg font-bold hover:shadow-2xl transition-all duration-200 text-lg hover:scale-105"
          >
            LESSGOOOO!
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Connect with us on social media or send us an email.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Email */}
            <a
              href="mailto:contact@finix.com"
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500 font-medium">Email</p>
                <p className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                  contact@finix.com
                </p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/company/finix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500 font-medium">LinkedIn</p>
                <p className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                  /company/finix
                </p>
              </div>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com/finix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://instagram.com/finix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">FINIX</span>
          </div>
          <p className="text-sm">© 2025 FINIX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
