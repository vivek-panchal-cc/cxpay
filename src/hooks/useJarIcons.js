// useJarIcons.js
import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

// Internal module-scoped cache
let cachedIcons = null;
let cachedAt = null;
let fetchingPromise = null;

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

function shouldUseCache() {
  return cachedIcons && Date.now() - cachedAt < CACHE_EXPIRY;
}

async function fetchJarIcons(force = false) {
  if (shouldUseCache() && !force) return cachedIcons;
  if (fetchingPromise) return fetchingPromise;

  fetchingPromise = (async () => {
    const { data } = await apiRequest.getSavingJarIcons();
    if (!data.success) throw new Error(data.message || "Failed to fetch icons");

    cachedIcons = data.data;
    cachedAt = Date.now();
    return cachedIcons;
  })();

  return fetchingPromise.finally(() => {
    fetchingPromise = null;
  });
}

function useJarIcons() {
  const [jarIcon, setJarIcon] = useState(cachedIcons || []);
  const [jarIconLoading, setJarIconLoading] = useState(!shouldUseCache());

  useEffect(() => {
    let isMounted = true;

    if (!shouldUseCache()) {
      setJarIconLoading(true);
      fetchJarIcons()
        .then((data) => {
          if (isMounted) setJarIcon(data);
        })
        .catch(console.error)
        .finally(() => {
          if (isMounted) setJarIconLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return [jarIcon, jarIconLoading];
}

export default useJarIcons;
