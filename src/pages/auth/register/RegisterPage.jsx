import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../../redux/userSlice";
import { authAPI } from "../../../routes";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const res = await axios.post(`${authAPI}/register`, formData);
            dispatch(setAuthUser(res.data));
            toast.success("Register Successfully");
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
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex gap-1 items-center justify-center absolute left-4 top-4'>
                <img src={'/logo.svg'} alt="logo.svg" className="w-full" />
                <p className="text-xl font-semibold">Sociabuzz</p>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col w-[350px]' onSubmit={handleRegister}>
                    <h1 className='text-2xl text-center text-white'>Create your account</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow '
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className='btn rounded-md btn-primary text-xl text-white'>
                        {isPending ? "Loading..." : "Register"}
                    </button>
                    {isError && <p className='text-red-500 text-center'>{errorMessage}</p>}
                </form>
                <div className='mt-2'>
                    <p className='text-white text-lg'>Already have an account? <Link to='/login' className="text-blue-500 hover:underline">
                        Login
                    </Link></p>
                </div>
            </div>
        </div>
    );
};
export default RegisterPage;
