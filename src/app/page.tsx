export default function Home() {
  return (
    <div className="container mx-auto min-h-screen">
      <main className="mx-auto ">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rainbow-gradient-pastel rounded-full p-3 text-2xl shadow-md">🎪</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Social Circus Skills Tracker</h1>
              <p className="text-sm text-[#6b6b6b]">Level up your skills, craft, and performance</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <a href="#start" className="rainbow-gradient-pastel rounded-full px-4 py-2 text-sm font-semibold text-[#2d2d2d] shadow-md hover:shadow-lg transition">Teacher Login</a>
          </nav>
        </header>

        <section className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight bg-linear-to-r from-[#ff6b6b] via-[#339af0] to-[#da77f2] bg-clip-text text-transparent">Train like a monkey. Perform like a pro.</h2>
            <p className="mt-4 max-w-xl text-lg text-[#6b6b6b]">
              Our Social Circus Skills Tracker helps you practice with playful habits, step-by-step challenges, and progress tracking.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a id="start" href="/app" className="rainbow-gradient-pastel inline-flex items-center gap-2 rounded-full px-5 py-3 text-[#2d2d2d] font-semibold shadow-md hover:shadow-lg transition">Start Free</a>
              <a href="#how" className="rainbow-gradient-diagonal inline-flex items-center gap-2 rounded-full border-2 border-[#ddd] px-5 py-3 text-white text-bold hover:border-[#999] hover:bg-white/60 transition">See How</a>
            </div>
          </div>

          <div className="rainbow-gradient-diagonal rounded-2xl p-1 shadow-md">
            <div className="rounded-2xl bg-[#faf8f3] p-6">
              <div className="mb-4 text-sm font-semibold text-[#ff6b6b]">Todays Spotlight</div>
              <div className="rounded-lg bg-white p-6 flex items-center gap-4 shadow-sm">
                <div className="hidden sm:flex items-center justify-center w-32 text-4xl">🤸‍♀️</div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2d2d2d]">Learn Juggling — 10-minute drills</h3>
                  <p className="mt-2 text-sm text-[#6b6b6b]">Short, focussed sessions you can repeat daily to build coordination and focus.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-block rounded-full bg-linear-to-r from-[#ff6b6b] to-[#ff922b] px-3 py-1 text-sm font-medium text-white">Practice</span>
                    <span className="inline-block rounded-full bg-linear-to-r from-[#339af0] to-[#0099ff] px-3 py-1 text-sm font-medium text-white">Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h3 className="text-2xl font-bold text-[#2d2d2d]">What we help you level up</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#ddd] bg-white p-5 text-sm flex items-start gap-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 text-2xl">🤸</div>
              <div>
                <div className="font-semibold text-[#2d2d2d]">Skills Practice</div>
                <div className="mt-2 text-[#6b6b6b]">Guided drills and exercises for steady improvement.</div>
              </div>
            </div>
            <div className="rounded-xl border border-[#ddd] bg-white p-5 text-sm flex items-start gap-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 text-2xl">🎯</div>
              <div>
                <div className="font-semibold text-[#2d2d2d]">Challenges</div>
                <div className="mt-2 text-[#6b6b6b]">Fun weekly tasks to push your comfort zone.</div>
              </div>
            </div>
            <div className="rounded-xl border border-[#ddd] bg-white p-5 text-sm flex items-start gap-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 text-2xl">👥</div>
              <div>
                <div className="font-semibold text-[#2d2d2d]">Coaching</div>
                <div className="mt-2 text-[#6b6b6b]">Feedback loops and tips from peers and mentors.</div>
              </div>
            </div>
            <div className="rounded-xl border border-[#ddd] bg-white p-5 text-sm flex items-start gap-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 text-2xl">📈</div>
              <div>
                <div className="font-semibold text-[#2d2d2d]">Progress Tracking</div>
                <div className="mt-2 text-[#6b6b6b]">Visualize growth across any skill you care about.</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#ddd] pt-6 text-sm rainbow-gradient-text text-center">
          <div>Made with a wink and a top hat — here to help you level up, one playful step at a time.</div>
        </footer>
      </main>
    </div>
  );
}
