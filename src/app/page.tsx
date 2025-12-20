export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-yellow-50 to-white font-sans text-zinc-900 dark:from-black dark:via-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-20">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/10 p-3 text-2xl">🎪</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Circus Skills</h1>
              <p className="text-sm text-zinc-600">Level up play, craft, and performance</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <a href="#features" className="text-sm font-medium text-zinc-700 hover:underline">Features</a>
            <a href="#how" className="text-sm font-medium text-zinc-700 hover:underline">How it works</a>
            <a href="#start" className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">Get Started</a>
          </nav>
        </header>

        <section className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Train like a performer. Grow like a pro.</h2>
            <p className="mt-4 max-w-xl text-lg text-zinc-700">
              Circus Skills helps you practice everyday abilities — from juggling and public speaking to coding and creativity — with playful habits, step-by-step challenges, and progress tracking.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a id="start" href="/app" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-white shadow hover:bg-red-700">Start Free</a>
              <a href="#how" className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-zinc-800 hover:bg-black/5">See How</a>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-red-50 p-6 shadow-lg">
            <div className="mb-4 text-sm font-semibold text-zinc-700">Today’s Spotlight</div>
            <div className="rounded-md bg-white p-6 flex items-center gap-4">
              <div className="hidden sm:flex items-center justify-center w-32 text-4xl">🤸‍♀️</div>
              <div>
                <h3 className="text-xl font-semibold">Learn Juggling — 10-minute drills</h3>
                <p className="mt-2 text-sm text-zinc-600">Short, focused sessions you can repeat daily to build coordination and focus.</p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">Practice</span>
                  <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">Progress</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h3 className="text-2xl font-bold">What we help you level up</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-5 text-sm flex items-start gap-3">
              <div className="w-10 text-2xl">🤸</div>
              <div>
                <div className="font-semibold">Skills Practice</div>
                <div className="mt-2 text-zinc-600">Guided drills and exercises for steady improvement.</div>
              </div>
            </div>
            <div className="rounded-xl border p-5 text-sm">
              <div className="font-semibold">Challenges</div>
              <div className="mt-2 text-zinc-600">Fun weekly tasks to push your comfort zone.</div>
            </div>
            <div className="rounded-xl border p-5 text-sm">
              <div className="font-semibold">Coaching</div>
              <div className="mt-2 text-zinc-600">Feedback loops and tips from peers and mentors.</div>
            </div>
            <div className="rounded-xl border p-5 text-sm">
              <div className="font-semibold">Progress Tracking</div>
              <div className="mt-2 text-zinc-600">Visualize growth across any skill you care about.</div>
            </div>
          </div>
        </section>

        <section id="how" className="mt-16">
          <h3 className="text-2xl font-bold">How it works</h3>
          <ol className="mt-4 space-y-3 text-sm text-zinc-700">
            <li>1. Pick a skill and a short daily exercise.</li>
            <li>2. Practice with short, focused sessions.</li>
            <li>3. Track progress and join challenges.</li>
          </ol>
        </section>

        <footer className="mt-20 border-t pt-6 text-sm text-zinc-600">
          <div>Made with a wink and a top hat — here to help you level up, one playful step at a time.</div>
        </footer>
      </main>
    </div>
  );
}
