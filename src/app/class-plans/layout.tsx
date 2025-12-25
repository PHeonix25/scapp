import React, { Suspense } from 'react';

export default function ClassPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      {children}
    </Suspense>
  );
}
