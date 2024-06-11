import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuthUser, setSuggestedUsers, setUserProfile } from "../../redux/userSlice";
import { setAllPosts } from "../../redux/postSlice";
import { setNotifications } from "../../redux/notificationSlice";
import { authAPI } from "../../routes";

const Sidebar = () => {
	const { authUser } = useSelector(store => store.user);
	const dispatch = useDispatch();

	const handleLogout = async (e) => {
		try {
			const res = await axios.get(`${authAPI}/logout`);
			toast.success("Logout Successfully");
			dispatch(setAuthUser(null));
			dispatch(setSuggestedUsers([]));
			dispatch(setUserProfile(null));
			dispatch(setAllPosts([]));
			dispatch(setNotifications([]));
		} catch (err) {
			toast.error("Something went wrong");
		}
	}
	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r py-4 px-2 border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center mb-4 items-center gap-1 md:justify-start'>
					<img src={'/logo.svg'} alt="logo.svg" />
					<p className="text-xl font-semibold hidden md:block">Sociabuzz</p>
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 w-full cursor-pointer'
						>
							<MdHomeFilled className='w-7 h-7' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 w-full cursor-pointer'
						>
							<IoNotifications className='w-7 h-7' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 w-full cursor-pointer'
						>
							<BsFillPersonFill className='w-7 h-7' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<div className='mt-auto flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 w-full cursor-pointer' onClick={handleLogout}>
						<SlLogout className='w-6 h-6' />
						<span className='text-lg hidden md:block'>Logout</span>
					</div>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
