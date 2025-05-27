import {
  Star,
  ArrowRight,
  Eye,
  Users,
  TrendingUp,
  Shield,
  MessageSquare,
  Award,
  CheckCircle,
} from "lucide-react";

export default function R8M8Landing() {
  return (
    <div className="min-h-screen bg-slate-100 text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400">
                <span className="text-lg font-bold text-white">R8</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">RateMate</h1>
                <p className="text-sm text-gray-600">R8M8</p>
              </div>
            </div>
            <nav className="hidden space-x-8 md:flex">
              <a
                href="#features"
                className="text-black transition-colors hover:text-violet-400"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-black transition-colors hover:text-violet-400"
              >
                Benefits
              </a>
              <a
                href="#how-it-works"
                className="text-black transition-colors hover:text-violet-400"
              >
                How It Works
              </a>
            </nav>
            <button className="rounded-lg bg-violet-400 px-6 py-2 text-white transition-colors hover:bg-violet-500">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8">
            <span className="mb-6 inline-flex items-center rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-800">
              <Star className="mr-2 h-4 w-4" />
              Transform Your Workplace Culture
            </span>
          </div>
          <h2 className="mb-6 text-5xl leading-tight font-bold text-black md:text-6xl">
            Build Better Teams with
            <span className="block text-violet-400">Constructive Feedback</span>
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-700">
            R8M8 empowers your office to create a culture of continuous
            improvement through meaningful peer feedback. Boost efficiency,
            enhance collaboration, and create the workplace everyone wants to be
            part of.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="flex transform items-center rounded-lg bg-violet-400 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-violet-500">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="rounded-lg bg-slate-200 px-8 py-4 text-lg font-semibold text-black transition-colors hover:bg-slate-300">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-200 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-3xl font-bold text-violet-400 md:text-4xl">
                87%
              </div>
              <p className="text-gray-700">Improved Team Communication</p>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-violet-400 md:text-4xl">
                65%
              </div>
              <p className="text-gray-700">Increase in Productivity</p>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-violet-400 md:text-4xl">
                92%
              </div>
              <p className="text-gray-700">Employee Satisfaction</p>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-violet-400 md:text-4xl">
                50+
              </div>
              <p className="text-gray-700">Companies Trust R8M8</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h3 className="mb-6 text-4xl font-bold text-black">
              Powerful Features for Modern Workplaces
            </h3>
            <p className="mx-auto max-w-2xl text-xl text-gray-700">
              Everything you need to foster a culture of growth and continuous
              improvement
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-slate-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <Eye className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Public & Private Reviews
              </h4>
              <p className="text-gray-700">
                Choose to give feedback openly or anonymously. Perfect for
                sensitive topics or public recognition.
              </p>
            </div>
            <div className="rounded-xl bg-slate-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <Users className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Team Collaboration
              </h4>
              <p className="text-gray-700">
                Build stronger relationships through constructive feedback and
                peer recognition systems.
              </p>
            </div>
            <div className="rounded-xl bg-slate-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <TrendingUp className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Performance Insights
              </h4>
              <p className="text-gray-700">
                Track improvement trends and identify areas where your team
                excels or needs support.
              </p>
            </div>
            <div className="rounded-xl bg-slate-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <Shield className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Safe Environment
              </h4>
              <p className="text-gray-700">
                Create a secure space for honest feedback with built-in
                moderation and privacy controls.
              </p>
            </div>
            <div className="rounded-xl bg-slate-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <MessageSquare className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Structured Feedback
              </h4>
              <p className="text-gray-700">
                Use guided templates to ensure feedback is constructive,
                specific, and actionable.
              </p>
            </div>
            <div className="rounded-xl bg-slate-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <Award className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Recognition System
              </h4>
              <p className="text-gray-700">
                Celebrate achievements and acknowledge great work to boost
                morale and motivation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="bg-slate-200 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h3 className="mb-8 text-4xl font-bold text-black">
                Why Teams Choose R8M8
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-violet-400" />
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-black">
                      Improved Office Climate
                    </h4>
                    <p className="text-gray-700">
                      Foster open communication and trust among team members
                      through regular, constructive feedback exchanges.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-violet-400" />
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-black">
                      Enhanced Efficiency
                    </h4>
                    <p className="text-gray-700">
                      Identify bottlenecks and improvement opportunities
                      quickly, leading to streamlined workflows and better
                      results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-violet-400" />
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-black">
                      Professional Growth
                    </h4>
                    <p className="text-gray-700">
                      Help employees develop their skills through targeted
                      feedback and peer learning opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-violet-400" />
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-black">
                      Flexible Privacy Options
                    </h4>
                    <p className="text-gray-700">
                      Choose anonymous feedback for sensitive topics or public
                      recognition for celebrating successes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-violet-50 p-8">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-400">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <blockquote className="mb-6 text-lg text-gray-800 italic">
                  "R8M8 transformed how our team communicates. We've seen a 40%
                  improvement in project completion times and much better
                  collaboration across departments."
                </blockquote>
                <div className="font-semibold text-black">Sarah Chen</div>
                <div className="text-gray-600">
                  Head of Operations, TechFlow Inc.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h3 className="mb-6 text-4xl font-bold text-black">
              Simple. Effective. Transformative.
            </h3>
            <p className="mx-auto max-w-2xl text-xl text-gray-700">
              Get started in minutes and see immediate improvements in team
              dynamics
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-400 text-2xl font-bold text-white">
                1
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Set Up Your Team
              </h4>
              <p className="text-gray-700">
                Invite your colleagues and customize feedback categories that
                matter to your workplace.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-400 text-2xl font-bold text-white">
                2
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Give & Receive Feedback
              </h4>
              <p className="text-gray-700">
                Share constructive feedback publicly or privately using our
                guided templates and rating system.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-400 text-2xl font-bold text-white">
                3
              </div>
              <h4 className="mb-4 text-xl font-semibold text-black">
                Watch Your Team Thrive
              </h4>
              <p className="text-gray-700">
                Track improvements, celebrate wins, and build a stronger, more
                connected workplace culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-400 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-6 text-4xl font-bold">
            Ready to Transform Your Workplace?
          </h3>
          <p className="mb-10 text-xl opacity-90">
            Join hundreds of teams already using R8M8 to build better, more
            collaborative work environments.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-violet-400 transition-colors hover:bg-gray-100">
              Start Free Trial
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-violet-400">
              Schedule Demo
            </button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • 14-day free trial • Setup in under 5
            minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-200 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400">
                  <span className="font-bold text-white">R8</span>
                </div>
                <span className="text-xl font-bold text-black">RateMate</span>
              </div>
              <p className="text-gray-700">
                Building better workplaces through meaningful feedback and
                collaboration.
              </p>
            </div>
            <div>
              <h5 className="mb-4 font-semibold text-black">Product</h5>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-semibold text-black">Company</h5>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-semibold text-black">Support</h5>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-violet-400"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-300 pt-8 text-center text-gray-600">
            <p>&copy; 2025 RateMate (R8M8). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
