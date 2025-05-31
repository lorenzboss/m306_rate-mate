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
    <footer className="flex h-20 flex-col items-center justify-between bg-slate-200">
      <div className="h-2 w-full bg-linear-to-t from-slate-200 to-slate-100" />
      <p className="mb-6 flex w-1/2 flex-row justify-evenly xl:w-1/3">
        Authors
        {authors.map((author, index) => (
          <a
            key={index}
            href={author.github}
            target="_blank"
            className="font-bold transition-all duration-300 hover:text-violet-500"
            rel="noreferrer"
          >
            {author.name}
          </a>
        ))}
      </p>
    </footer>
  );
}
