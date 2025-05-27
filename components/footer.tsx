export default function Footer() {
  return (
    <footer className="flex h-20 flex-col items-center justify-between bg-slate-200">
      <div className="h-2 w-full bg-linear-to-t from-slate-200 to-slate-100" />
      <p className="mb-6 flex w-1/3 flex-row justify-evenly">
        Authors
        <a
          href="https://github.com/lorenzboss"
          target="_blank"
          className="font-bold transition-all duration-300 hover:text-violet-500"
          rel="noreferrer"
        >
          Lorenz Boss
        </a>
        <a
          href="https://github.com/levin-fankhauser"
          target="_blank"
          className="font-bold transition-all duration-300 hover:text-violet-500"
          rel="noreferrer"
        >
          Levin Fankhauser
        </a>
        <a
          href="https://github.com/BrickiBulli"
          target="_blank"
          className="font-bold transition-all duration-300 hover:text-violet-500"
          rel="noreferrer"
        >
          Seth Schmutz
        </a>
      </p>
    </footer>
  );
}
