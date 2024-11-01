import { API_Url } from '@/constants/ApiUrl';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toaster,Toaster } from "@/components/ui/toaster"
import { toast } from 'react-toastify';
interface AuthContextProps {
  user: User | null;
  login: (user: User,loading: (value: boolean) => void) => Promise<any>;
  logout: () => void;
  signUp: (user: User,loading: (value: boolean) => void) => Promise<any>;
}

interface User {
  email: string;
  password: string;
  name: string;
  prenom: string;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler la récupération de l'utilisateur à partir du stockage local ou d'un appel d'API
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (user: User,loading: (value: boolean) => void) => {
    loading(true)
   try{ const response = await fetch(API_Url + '/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });
    const data = await response.json();
    if (response.status === 201) {
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Welcome back! '+user.email,{
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
      navigate('/');
      setUser(user);
      return data;
    }
    else {
      toaster.create(
        {
          type: "error",
          title: data.message,
        }
      )
      console.log('error');
      return null;
    }}
    catch(e){

      console.log(e);
      return null;
    }
    finally{
      loading(false)
    }
  };
  const signUp = async(user: User,loading: (value: boolean) => void) => {
    loading(true)
   try{ const response = await fetch(API_Url + '/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        prenom: user.prenom,
        nom: user.name,
      }),
    });
    const data = await response.json();
    if (data) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      toast.success('Welcome! '+user.email,{
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return data;
    }
    else {
      toaster.create(
        {
          type: "error",
          title: data.message,
        }
      )
      console.log('error');
      return null;
    }}
    catch(e){

      console.log(e);
      return null;
    }
    finally{
      loading(false)
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');

    toast.info('You have been logged out',{
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
