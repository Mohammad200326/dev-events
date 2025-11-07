import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await response.json();

  if (!event) notFound();

  return (
    <section id="event">
      <h1>
        Event Details: <br /> {slug}
      </h1>
    </section>
  );
};

export default Page;
