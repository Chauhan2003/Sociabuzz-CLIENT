import { useState } from "react";
import axios from 'axios';

import { MdOutlineMail } from "react-icons/md";
import { authAPI } from "../../routes";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: ""
    });
    const navigate = useNavigate();

    const handlePasswordForget = async (e) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const res = await axios.post(`${authAPI}/forget-password`, formData);
            navigate('/login');
            toast.success(res.data.message);
        } catch (err) {
            setIsError(true);
            setErrorMessage(err.response.data.error || "Internal Server Error")
            setTimeout(() => {
                setIsError(false);
                setErrorMessage("");
            }, 5000);
        } finally {
            setIsPending(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex gap-1 items-center justify-center absolute left-4 top-4'>
                <img src={'/logo.svg'} alt="logo.svg" className="w-full" />
                <p className="text-xl font-semibold">Sociabuzz</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col w-[350px]' onSubmit={handlePasswordForget}>
                    <h1 className='text-2xl text-center text-white'>Forget Password</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <button className='btn rounded-md btn-primary text-xl text-white'>
                        {isPending ? "Loading..." : "Forget Password"}
                    </button>
                    {isError && <p className='text-red-500 text-center'>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};
export default ForgetPassword;
