import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../../redux/userSlice";
import toast from "react-hot-toast";
import { authAPI } from "../../../routes";

const LoginPage = () => {
	const dispatch = useDispatch();
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsPending(true);

		try {
			const res = await axios.post(`${authAPI}/login`, formData);
			dispatch(setAuthUser(res.data));
			toast.success("Login Successfully");
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
				<form className='flex gap-4 flex-col w-[350px]' onSubmit={handleLogin}>
					<h1 className='text-2xl text-center text-white'>Login to get started</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

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
					<Link to={'/forget-password'} className="text-white hover:underline text-sm w-max">Forget Password</Link>
					<button className='btn rounded-md btn-primary text-xl text-white'>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500 text-center'>{errorMessage}</p>}
				</form>
				<div className='mt-2'>
					<p className='text-white text-lg'>Don't have an account? <Link to='/register' className="text-blue-500 hover:underline">
						Register
					</Link></p>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
