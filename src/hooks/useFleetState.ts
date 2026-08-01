import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useFleetState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const getArray = useCallback((key: string) => {
    return searchParams.get(key)?.split(',').filter(Boolean) || [];
  }, [searchParams]);

  const toggleArrayItem = useCallback((key: string, item: string) => {
    const current = getArray(key);
    const updated = current.includes(item) 
      ? current.filter(i => i !== item) 
      : [...current, item];
    updateParams({ [key]: updated.length > 0 ? updated.join(',') : null, page: "1" });
  }, [getArray, updateParams]);

  return {
    q: searchParams.get('q') || "",
    setQ: (val: string) => updateParams({ q: val || null, page: "1" }),
    
    dest: getArray('dest'),
    toggleDest: (val: string) => toggleArrayItem('dest', val),

    minPrice: searchParams.get('minPrice') || "",
    maxPrice: searchParams.get('maxPrice') || "",
    setPriceRange: (min: string, max: string) => updateParams({ minPrice: min || null, maxPrice: max || null, page: "1" }),

    guests: getArray('guests'),
    toggleGuests: (val: string) => toggleArrayItem('guests', val),

    type: getArray('type'),
    toggleType: (val: string) => toggleArrayItem('type', val),

    exp: getArray('exp'),
    toggleExp: (val: string) => toggleArrayItem('exp', val),

    amenities: getArray('amenities'),
    toggleAmenity: (val: string) => toggleArrayItem('amenities', val),

    sort: searchParams.get('sort') || "recommended",
    setSort: (val: string) => updateParams({ sort: val, page: "1" }),

    page: parseInt(searchParams.get('page') || "1", 10),
    setPage: (val: number) => updateParams({ page: val.toString() }),

    clearAll: () => router.replace(pathname, { scroll: false })
  };
}
