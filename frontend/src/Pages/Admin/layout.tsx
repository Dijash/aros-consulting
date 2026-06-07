import Body from '../Admin/body';

export default function AdminLayout({ token }: { token: string }) {
  return <Body token={token} />;
}
