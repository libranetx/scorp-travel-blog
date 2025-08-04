export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>If you can see this, the basic app is working.</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Environment Check:</h2>
        <ul className="list-disc pl-4">
          <li>DATABASE_URL: {process.env.DATABASE_URL ? 'Set' : 'Missing'}</li>
          <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? 'Set' : 'Missing'}</li>
          <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing'}</li>
          <li>NODE_ENV: {process.env.NODE_ENV}</li>
        </ul>
      </div>
    </div>
  )
} 