// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Box, Button, Input, Heading, VStack } from '@chakra-ui/react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '@/components/ui/password-input';
import { CgUser, CgUserAdd } from 'react-icons/cg';
import { BiTransfer } from 'react-icons/bi';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const { login } = useAuth();
  const [state, setState] = useState('Connexion');

  const handleLogin = () => {
    // Logique de connexion (exemple de vérification de base)
    const user = { id: '1', name: 'John Doe', email };
    login(user);
  };

  return (
    <div className='login-form'>
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
            <Button onClick={() => setState('Connexion')} color={state === 'Connexion' ? 'green.800' : 'gray'} bg={state === 'Connexion' ? 'green.100' : 'gray.100'} width={"50%"}>
               <CgUser/> Connexion
            </Button>
            <Button onClick={() => setState('Inscription')} color={state === 'Inscription' ? 'green.800' : 'gray'} bg={state === 'Inscription' ? 'green.100' : 'gray.100'} width={"50%"}>
                <CgUserAdd/>
                Inscription
            </Button>
        </Box>

        {
            state === 'Inscription' && (
              <> <Input
                    type="text"
                    placeholder="Entrez votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    color={'gray.800'}
                    size={'xl'}
                    variant="subtle" 
                    bg={'gray.100'}
                />

                <Input
                    type="prenom"
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
 
        <Button colorScheme="blue" onClick={handleLogin} size={'lg'} bg={'green.400'} _hover={{ bg: 'green.500' }} width={'100%'}>
          Se connecter
        </Button>
      </VStack>
    </Box>
    </div>
  );
};

export default LoginPage;
