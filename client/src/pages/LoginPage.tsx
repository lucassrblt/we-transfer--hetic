// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Heading, VStack, Spinner } from '@chakra-ui/react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '@/components/ui/password-input';
import { CgUser, CgUserAdd } from 'react-icons/cg';
import { BiTransfer } from 'react-icons/bi';
import { toaster,Toaster } from '@/components/ui/toaster';

const LoginPage: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [loading, setLoading] = useState(false);
  const { login,user,signUp } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState('SignIn');
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);


  const handleLogin = async () => {
    const user = { email: email , password: password , name: "", prenom: ""};
    const loginResponse =  login(user,setLoading);
  };
  const handleSignUp = async() => {
    const user = { email: email , password: password, name: name, prenom: prenom};
     const signUpResponse =  signUp(user,setLoading);
  }

  const action = ()=>{
    if(state === 'SignIn'){
      handleLogin();
    }else{
      handleSignUp();
    }
  }

 

  return (
    <div className='login-form'>
         <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toaster.create({
          description: "File saved successfully",
          type: "info",
        })
      }
    >
      Show Toast
    </Button>
        <Box
        mx="auto"
        bg={'white'}
        p={6}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        >
      <VStack  align="center" gap={4}>
        <Heading as="h4" size="lg" textAlign="center" color={'gray.800'} display={"flex"} justifyContent={"center"} alignItems={"center"} >
            <Box as="span" color={'green.600'}>Hetic</Box>Transfer <BiTransfer style={{marginLeft: '10px'}}/>
        </Heading>
         <Box width={"100%"} textAlign="center" display={"flex"} justifyContent={"space-between"} position={"relative"}>
            <Button onClick={() => setState('SignIn')} color={state === 'SignIn' ? 'green.800' : 'gray'} bg={state === 'SignIn' ? 'green.100' : 'gray.100'} width={"50%"}>
               <CgUser/> SignIn
            </Button>
            <Button onClick={() => setState('SignUp')} color={state === 'SignUp' ? 'green.800' : 'gray'} bg={state === 'SignUp' ? 'green.100' : 'gray.100'} width={"50%"}>
                <CgUserAdd/>
                SignUp
            </Button>
        </Box>

        {
            state === 'SignUp' && (
              <> <Input
                    type="name"
                    placeholder="Entrez votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    color={'gray.800'}
                    size={'xl'}
                    variant="subtle" 
                    bg={'gray.100'}
                />

                <Input
                    type="surname"
                    placeholder="Entrez votre prenom"
                    value={prenom}
                    variant="subtle" 
                    bg={'gray.100'}
                    onChange={(e) => setPrenom(e.target.value)}
                    color={'gray.800'}
                    size={'xl'}
                    />
            </> 
            )
        }
 
          <Input
            type="email"
            variant="subtle" 
            bg={'gray.100'}
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color={'gray.800'}
            size={'xl'}
          />
        

   
          <PasswordInput variant="subtle" 
            bg={'gray.100'} value={password} onChange={(e) => setPassword(e.target.value)} color={'gray.800'} size={'xl'} colorPalette={'gray'} placeholder='Entrez votre mot de passe' colorScheme={'gray'} />
 
        <Button colorScheme="blue" onClick={action} size={'lg'} bg={'green.400'} _hover={{ bg: 'green.500' }} width={'100%'}>
          {
            loading ? <Spinner size="sm" color="white" /> : state === 'SignIn' ? 'Se connecter' : 'S\'inscrire'
        }
        </Button>
      </VStack>
    </Box>
    </div>
  );
};

export default LoginPage;
