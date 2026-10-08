import { useEffect, useState } from 'react';
import api from '../../config/axios';
export default function useSession() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const verifySession  = async () => {
            const token = localStorage.getItem('AUTH_TOKEN');
            
            if (!token) {
                setIsAuthenticated(false)
                setLoading(false)
                return
            }
            
            try {
                await api.get('/auth/verify', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Token is valid:')
                setIsAuthenticated(true)
                setLoading(false)
            } catch (error) {
                console.error('Token is invalid or expired:', error)
                localStorage.removeItem('AUTH_TOKEN')
                setIsAuthenticated(false)
            } finally { 
                setLoading(false)
            }
        }
        verifySession()
    },[])
    return { isAuthenticated, loading }
}