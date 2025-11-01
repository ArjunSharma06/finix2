import Link from "next/link"
import { ArrowRight, TrendingUp, Shield, BarChart3 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">Fx</span>
            </div>
            <span className="font-bold text-xl text-foreground">FINIX</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
              FINIX.
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Track spending, split bills, and get AI-powered insights. Take control of your finances with FINIX.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">FINIX.
</h2>
          <p className="text-lg text-muted-foreground">Everything you need for complete financial control</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl border border-border p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Smart Analytics</h3>
            <p className="text-muted-foreground">
              Real-time insights into your spending patterns with AI-powered recommendations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl border border-border p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Bank-Level Security</h3>
            <p className="text-muted-foreground">
              Your financial data is protected with enterprise-grade encryption and security.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl border border-border p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Bill Splitting</h3>
            <p className="text-muted-foreground">
              Effortlessly split expenses with friends and settle debts automatically.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold text-primary-foreground">Ready to Manage Your Finances?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands using FINIX to take control of their money today.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2025 FINIX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
