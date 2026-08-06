"use client";

import { useQuery } from "@tanstack/react-query";
import { storefrontApi } from "@/services/storefront-api";
import { storefrontKeys } from "@/lib/storefront/query-keys";
import type { HomeData, NavigationData } from "@/types/storefront";

export function useHome(initialData?: HomeData) {
  return useQuery({
    queryKey: storefrontKeys.home(),
    queryFn: () => storefrontApi.home(),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNavigation(initialData?: NavigationData) {
  return useQuery({
    queryKey: storefrontKeys.navigation(),
    queryFn: () => storefrontApi.navigation(),
    initialData,
    staleTime: 10 * 60 * 1000,
  });
}

export function useProducts(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: storefrontKeys.products(params),
    queryFn: () => storefrontApi.products(params),
    staleTime: 5 * 60 * 1000,
  });
}
