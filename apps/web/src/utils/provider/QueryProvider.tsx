"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { FC, ReactNode, useState } from 'react';

const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
