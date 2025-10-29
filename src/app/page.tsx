import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-3xl">Halow</h1>

      <h3 className="text-2xl font-semibold">Hello</h3>
      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </div>
  );
}
