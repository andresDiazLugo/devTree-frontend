import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUserByHandle } from '../api/DevTreeAPI'
import UserInfo from '../components/UserInfo'
export default function HandleView() {
  const { handle } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ['user', handle],
    retry: 1,
  })
  if (isLoading) {
    return <div>Cargando...</div>
  }
  if (isError) {
    return <Navigate to="/404" replace />
  }
  return (
    <UserInfo userData={data} />
  )
}