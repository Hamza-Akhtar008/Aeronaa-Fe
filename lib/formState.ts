import { useEffect } from 'react';

export function useRestoreFormState(formStateKey: string, setForm: (data: any) => void) {
  useEffect(() => {
    const saved = localStorage.getItem(formStateKey);
    if (saved) {
      try {
        setForm(JSON.parse(saved));
        localStorage.removeItem(formStateKey);
      } catch {}
    }
  }, [formStateKey, setForm]);
}

export function saveFormState(formStateKey: string, data: any) {
  localStorage.setItem(formStateKey, JSON.stringify(data));
}
