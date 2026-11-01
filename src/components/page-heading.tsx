type Props = {
  title: string;
  intro?: string;
};

export function PageHeading({ title, intro }: Props) {
  return (
    <section className="mx-auto max-w-page px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {intro && <p className="mt-5 max-w-prose text-lg text-muted">{intro}</p>}
    </section>
  );
}
