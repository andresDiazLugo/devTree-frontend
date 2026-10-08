import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginView from './view/LoginView'
import RegisterView from './view/RegisterView'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import LinkTreeView from './view/LinkTreeView'
import ProfileView from './view/ProfileView'
// import ProtectedRoute from './auth/guard/ProtectedRouter'
import HandleView from './view/HandleView'
import NotFoundView from './view/NotFoundView'
import HomeView from './view/HomeView'

export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route 
                    path="/"
                    element={<Navigate to="/auth/login" replace />}
                />
                //public routes
                <Route element={<AuthLayout/>}>
                    <Route path="/auth/login" element={<LoginView/>} />
                    <Route path="/auth/register" element={<RegisterView/>} />
                </Route>
                // Protected routes
                {/* <Route 
                // element={<ProtectedRoute/>}
                > */}
                <Route path='/admin' element={<AppLayout/>}>
                    <Route index element={<LinkTreeView/>}/>
                    <Route path="profile" element={<ProfileView/>}/>
                </Route>
                {/* </Route> */}
                <Route path="/:handle" element={<AppLayout onlyHeader={true}/>}>
                    <Route element={<HandleView/>} index={true}/>                
                </Route>
                <Route path="/404" element={<AppLayout onlyHeader={true}/>}>
                    <Route index element={<NotFoundView/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}