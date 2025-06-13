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
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-violet-50/30 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl" />
        </div>
        
        <div className="relative px-6 py-8 md:py-12">
          <div className="mx-auto max-w-7xl">
            {/* Main content */}
            <div className="text-center space-y-8">
              
              {/* Made with love section */}
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <span className="text-sm font-medium">Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-sm font-medium">by the R8M8 team</span>
              </div>

              {/* Authors section */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-slate-700">
                  <Code className="w-5 h-5 text-violet-500" />
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
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
                      className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:scale-105"
                    >
                      <Github className="w-4 h-4 text-slate-500 group-hover:text-violet-600 transition-colors duration-300" />
                      <span className="font-medium text-slate-700 group-hover:text-violet-600 transition-colors duration-300">
                        {author.name}
                      </span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Copyright and additional info */}
              <div className="pt-6 border-t border-slate-200/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-4">
                    <p>&copy; 2025 R8M8. All rights reserved.</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1">
                      Built with 
                      <span className="font-medium text-violet-600">Next.js</span>
                    </span>
                    <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="flex items-center gap-1">
                      Styled with
                      <span className="font-medium text-violet-600">Tailwind CSS</span>
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