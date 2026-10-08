import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Navigate } from 'react-router-dom'
import useSession from '../auth/hook/session'
export default function AuthLayout() {
    const { isAuthenticated, loading } = useSession()
    
    if (loading) {
        return <div>Loading...</div>
    }
    
    if (isAuthenticated) {
        return <Navigate to="/admin" replace />
    }

  return (
   <>
        <div className='bg-slate-800 min-h-screen'>
            <div className='max-w-lg mx-auto pt-10 px-5'>
                <img src='/logo.svg' alt='Logotipo Devtree'/>
                <div className='py-10'>
                    <Outlet/>
                </div>
            </div>
        </div>
        <Toaster richColors position='top-right'/>
   </>
  )
}