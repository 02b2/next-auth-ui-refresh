import React, { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { AiOutlineMail, AiOutlineUnlock } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import AppLogoTitle from '../AppLogoTitle';
import {
    Container,
    Form,
    FormTitle,
    InfoText,
    InfoTextContainer,
    Link
} from './FormElements';
import InputFeild from './InputFeild';
import Button from '../Button';
import {InputErrors} from '../../types/error';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { ErrorText } from './InputFeildElements'
import { loginUser } from '../../helpers/index';

const SignupForm = () => {
    const [data, setData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [validationErrors, setValidationErrors] = useState<InputErrors[]>([]);
    const [submitError, setSubmitError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter();

    // Data validation function
    const validateData = (): boolean => {
        const err = [];

        // Error conditions
        if(data.fullName?.length < 4) {
            err.push({fullName: "Full name must be at least 4 characters" });
        } else if(data.fullName?.length > 30) {
            err.push({fullName: "fullname should be less than 30 chars"});
        } else if(data.password?.length < 6) {
            err.push({password: "Password should be more than 6 chars long"});
        } else if(data.password !== data.confirmPassword){
            err.push({confirmPassword: "password does not match"});
        }

        setValidationErrors(err);
        if(err.length > 0) {
            return false;
        } else {
            return true;
        }
    };

    // Signup event handler
    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Update data state just before the API call
        setData({
          fullName,
          email,
          password,
          confirmPassword,
        });
    
        const isValid = validateData();
        if(isValid) {
            setLoading(true);
            try {
                const apiRes = await axios.post("http://localhost:3000/api/auth/signup", data);
                if(apiRes?.data.success){
                   
                    const loginRes = await loginUser({
                        email: data.email,
                        password: data.password
                    })

                    if(loginRes && !loginRes.ok){
                        setSubmitError(loginRes.error || "")
                    }
                    else {
                        router.push("/")
                    }
                }
            } catch(error: unknown) {
                if(error instanceof AxiosError) {
                    const errorMsg = error.response?.data?.error;
                    setSubmitError(errorMsg);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Input field change event handler
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData({...data, [event.target.name]: event.target.value});
    };

    return (
        <Container>
            <AppLogoTitle />

            <Form onSubmit={handleSignup}>
                <FormTitle> Sign Up </FormTitle>

                <InputFeild
                    type="text"
                    placeholder={'Full Name'}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    icon={<BsPerson />}
                    required
                />
                <InputFeild
                    type="email"
                    placeholder={'Email'}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    icon={<AiOutlineMail />}
                    required
                />
                <InputFeild
                    type="password"
                    placeholder={'Password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    icon={<AiOutlineUnlock />}
                    required
                />
                <InputFeild
                    type="password"
                    placeholder={'Confirm Password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    icon={<RiLockPasswordLine />}
                    required
                />

                <Button
                    title={"Sign up"}
                    type="submit"
                    disabled={loading}
                />

                { 
                submitError && 
                <ErrorText>
                    {submitError}
                </ErrorText>
                }

                <InfoTextContainer>
                    <InfoText>
                        Already have account?
                    </InfoText>

                    <Link href={"/login"}>
                        Login
                    </Link>
                </InfoTextContainer>
            </Form>
        </Container>
    )
}

export default SignupForm