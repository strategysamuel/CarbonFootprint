import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps:       jest.fn(() => []),
  getApp:        jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth:                         jest.fn(),
  GoogleAuthProvider:              jest.fn().mockImplementation(() => ({ addScope: jest.fn() })),
  signInWithPopup:                 jest.fn(),
  signInWithEmailAndPassword:      jest.fn(),
  createUserWithEmailAndPassword:  jest.fn(),
  sendPasswordResetEmail:          jest.fn(),
  signOut:                         jest.fn(),
  onAuthStateChanged:              jest.fn(),
  updateProfile:                   jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore:    jest.fn(),
  collection:      jest.fn(),
  doc:             jest.fn(),
  getDoc:          jest.fn(),
  getDocs:         jest.fn(),
  setDoc:          jest.fn(),
  addDoc:          jest.fn(),
  updateDoc:       jest.fn(),
  deleteDoc:       jest.fn(),
  query:           jest.fn(),
  where:           jest.fn(),
  orderBy:         jest.fn(),
  limit:           jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  Timestamp: {
    fromDate: jest.fn((d: Date) => ({ toDate: () => d })),
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter:      jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  usePathname:    jest.fn(() => '/'),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div:    require('react').forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLDivElement>, ref: React.Ref<HTMLDivElement>) =>
      <div ref={ref} {...props}>{children}</div>),
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
    span:   ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
    p:      ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useScroll:    jest.fn(() => ({ scrollYProgress: { get: jest.fn() } })),
  useTransform: jest.fn(() => 0),
}));

// Suppress console errors in tests
global.console.error = jest.fn();
global.console.warn  = jest.fn();
