import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const cacheMap = new Map(); // category_id => { icons, cachedAt }
const fetchingMap = new Map(); // category_id => promise

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes
const DEBOUNCE_DELAY = 300;

function shouldUseCache(category_id) {
  const cache = cacheMap.get(category_id);
  return cache && Date.now() - cache.cachedAt < CACHE_EXPIRY;
}

async function fetchJarIcons(category_id, force = false) {
  if (shouldUseCache(category_id) && !force) {
    return cacheMap.get(category_id).icons;
  }

  if (fetchingMap.has(category_id)) {
    return fetchingMap.get(category_id);
  }

  const promise = (async () => {
    const { data } = await apiRequest.getSavingJarIcons({ category_id });
    if (!data.success) throw new Error(data.message || "Failed to fetch icons");

    cacheMap.set(category_id, {
      icons: data.data,
      cachedAt: Date.now(),
    });

    return data.data;
  })();

  fetchingMap.set(category_id, promise);

  return promise.finally(() => {
    fetchingMap.delete(category_id);
  });
}

function useJarIcons({ category_id, force = false }) {
  const [jarIcon, setJarIcon] = useState(() =>
    shouldUseCache(category_id) ? cacheMap.get(category_id).icons : []
  );
  const [jarIconLoading, setJarIconLoading] = useState(
    !shouldUseCache(category_id)
  );

  useEffect(() => {
    let debounceTimer;

    const shouldFetch = !shouldUseCache(category_id) || force;

    if (shouldFetch) {
      setJarIconLoading(true);

      debounceTimer = setTimeout(() => {
        fetchJarIcons(category_id, force)
          .then((data) => setJarIcon(data))
          .catch(console.error)
          .finally(() => setJarIconLoading(false));
      }, DEBOUNCE_DELAY);
    } else {
      // If cache is valid and force is false, load directly from cache
      setJarIcon(cacheMap.get(category_id).icons);
      setJarIconLoading(false);
    }

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [category_id, force]);

  return [jarIcon, jarIconLoading];
}

export default useJarIcons;
