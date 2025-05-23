'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to dynamically load fabric.js
 * @returns Object containing the fabric instance and loading state
 */
export function useFabric() {
  const [fabric, setFabric] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadAttemptedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Prevent multiple load attempts
    if (loadAttemptedRef.current) return;
    loadAttemptedRef.current = true;

    let mounted = true;

    const loadFabric = async () => {
      try {
        setLoading(true);

        // Log if fabric already exists in global scope before import
        if (typeof window !== 'undefined' && (window as any).fabric) {
          console.log('Fabric already exists in global scope before dynamic import');
        }

        // Import fabric dynamically
        const fabricModule = await import('fabric');
        console.log('Fabric module loaded:', fabricModule);

        // Check global scope after import
        if (typeof window !== 'undefined' && (window as any).fabric) {
          console.log('Fabric exists in global scope after import, using global instance');
          const globalFabric = (window as any).fabric;
          
          // Verify it has Canvas constructor
          if (globalFabric && typeof globalFabric.Canvas === 'function') {
            if (mounted) {
              setFabric(globalFabric);
              setLoading(false);
              return;
            }
          } else {
            console.warn('Global fabric found but missing Canvas constructor');
          }
        }

        // With fabric v5, we need to access the correct property
        let fabricInstance;
        
        if (fabricModule.fabric) {
          console.log('Using fabric from module.fabric property');
          fabricInstance = fabricModule.fabric;
        } else if (fabricModule.default) {
          console.log('Using fabric from module.default property');
          fabricInstance = fabricModule.default;
          
          // Some versions might have nested structure
          if (fabricInstance.fabric) {
            console.log('Using nested fabric.fabric property');
            fabricInstance = fabricInstance.fabric;
          }
        } else {
          // Last resort - check global again
          console.log('No direct fabric property found, checking global as fallback');
          fabricInstance = typeof window !== 'undefined' ? (window as any).fabric : null;
        }

        // Debug output
        console.log('Found fabric instance:', fabricInstance);
        
        // Log available methods on fabric instance
        if (fabricInstance) {
          console.log('Available properties on fabric:', Object.keys(fabricInstance));
          console.log('Canvas constructor exists:', typeof fabricInstance.Canvas === 'function');
        }
        
        // Verify we have Canvas constructor
        if (!fabricInstance || typeof fabricInstance.Canvas !== 'function') {
          throw new Error('Failed to load fabric.js: Canvas constructor not found');
        }

        if (mounted) {
          setFabric(fabricInstance);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error loading fabric.js:', err);
        if (mounted) {
          setError(err.message || 'Failed to load fabric.js');
          setLoading(false);
        }
      }
    };

    loadFabric();

    return () => {
      mounted = false;
    };
  }, []);

  return { fabric, loading, error };
}

export default useFabric; 