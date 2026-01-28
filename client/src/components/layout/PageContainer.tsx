import type { PropsWithChildren } from "react";

export default function PageContainer({ children }: PropsWithChildren) {
  return (
    <div className="bg-lavender">
      <h1>Page Container</h1>
      <h2> And what is inside 👇</h2>
      {children}
    </div>
  );
}
