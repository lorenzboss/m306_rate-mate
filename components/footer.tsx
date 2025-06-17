import { Github, Heart, Code } from "lucide-react";

export default function Footer() {
  const authors = [
    {
      name: "Lorenz Boss",
      github: "https://github.com/lorenzboss",
    },
    {
      name: "Levin Fankhauser",
      github: "https://github.com/levin-fankhauser",
    },
    {
      name: "Seth Schmutz",
      github: "https://github.com/BrickiBulli",
    },
  ];

  return (
    <footer className="relative mt-auto">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      {/* Background with subtle pattern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-violet-400 blur-3xl filter" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-400 blur-3xl filter" />
        </div>

        <div className="relative px-6 py-8 md:py-12">
          <div className="mx-auto max-w-7xl">
            {/* Main content */}
            <div className="space-y-8 text-center">
              {/* Made with love section */}
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <span className="text-sm font-medium">Made with</span>
                <Heart className="h-4 w-4 animate-pulse text-red-500" />
                <span className="text-sm font-medium">by the R8M8 team</span>
              </div>

              {/* Authors section */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-slate-700">
                  <Code className="h-5 w-5 text-violet-500" />
                  <h3 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-lg font-semibold text-transparent">
                    Meet the Developers
                  </h3>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                  {authors.map((author, index) => (
                    <a
                      key={index}
                      href={author.github}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-2 rounded-xl border border-white/30 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/10"
                    >
                      <Github className="h-4 w-4 text-slate-500 transition-colors duration-300 group-hover:text-violet-600" />
                      <span className="font-medium text-slate-700 transition-colors duration-300 group-hover:text-violet-600">
                        {author.name}
                      </span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Copyright and additional info */}
              <div className="border-t border-slate-200/50 pt-6">
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
                  <div className="flex items-center gap-4">
                    <p>&copy; 2025 R8M8. All rights reserved.</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1">
                      Built with
                      <span className="font-medium text-violet-600">
                        Next.js
                      </span>
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 md:block" />
                    <span className="flex items-center gap-1">
                      Styled with
                      <span className="font-medium text-violet-600">
                        Tailwind CSS
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
