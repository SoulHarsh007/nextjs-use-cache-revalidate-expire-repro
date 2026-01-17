import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { Suspense } from "react";

async function cachedTask() {
  "use cache";
  cacheLife("minutes");
  console.log(`Generating fresh response @ ${new Date().toUTCString()}`);
  await longWaitingTask();
  console.log(`Generated fresh response @ ${new Date().toUTCString()}`);
  return { status: "OK" };
}

async function longWaitingTask() {
  return new Promise((resolve) => setTimeout(resolve, 10 * 1000));
}

async function Home() {
  await connection();
  const data = await cachedTask();
  return <div>{JSON.stringify(data)}</div>;
}

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </main>
    </div>
  );
}
