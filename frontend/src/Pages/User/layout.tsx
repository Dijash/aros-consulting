import UserDashboard from './dashboard';

export default function UserLayout({ token, onLogout }: { token: string; onLogout: () => void }) {
  return <UserDashboard token={token} onLogout={onLogout} />;
}
