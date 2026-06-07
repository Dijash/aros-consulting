import { type ReactNode } from 'react';
import useInView from '../useInView';

export default function FadeUp({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`fade-up${inView ? ' in' : ''} ${className}`}>
      {children}
    </div>
  );
}
