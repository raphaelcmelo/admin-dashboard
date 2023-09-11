import SadFace from "@/components/icons/SadFace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { wait } from "@/lib/wait";
import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loading collections</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMsg() {
  const user = await currentUser();
  await wait(3000);

  if (!user) {
    return <div>No user</div>;
  } else {
    return (
      <div className="flex w-full mb-12">
        <h1 className="text-4x1 font-bold">
          Welcome, <br />
          {user.firstName} {user.lastName}
        </h1>
      </div>
    );
  }
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4x1 font-bold">
        <Skeleton className="w-[150px] h-[36px]" />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  await wait(3000);
  const collections = await prisma.colletction.findMany({
    where: {
      userId: user?.id,
    },
  });
  if (collections.length === 0) {
    return (
      <Alert>
        <SadFace />
        <AlertTitle>There are no collections yet</AlertTitle>
        <AlertDescription>Create a collection to get started</AlertDescription>
      </Alert>
    );
  }
}
