import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setNotifications } from "../../redux/notificationSlice";
import NotificationSkeleton from "../../components/skeletons/NotificationSkeleton";
import { notificationAPI } from "../../routes";

const NotificationPage = () => {
	const dispatch = useDispatch();
	const { notifications } = useSelector(store => store.notification);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		const fetchNotification = async () => {
			try {
				const res = await axios.get(`${notificationAPI}`);
				dispatch(setNotifications(res.data));
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchNotification();
	}, []);

	const deleteNotifications = async () => {
		try {
			const res = await axios.delete(`${notificationAPI}`);
			toast.success("Notifications deleted successfully");
			dispatch(setNotifications(null));
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-5 h-5' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<>
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
						<NotificationSkeleton />
					</>
				)}
				{!isLoading && notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{!isLoading && notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex justify-between p-4 items-center'>
							<Link to={`/profile/${notification.from.username}`} className="flex gap-2 items-center">
								<div className='avatar'>
									<div className='w-10 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-2 items-center'>
									<span className='font-semibold text-lg'>@{notification.from.username}</span>
									<span className={notification.type === "follow" ? "text-primary" : "text-red-500"}>{notification.type === "follow" ? "Following you" : "Liked your post"}</span>
								</div>
							</Link>

							{notification.type === "follow" && <FaUser className='w-6 h-6 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-6 h-6 text-red-500' />}
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default NotificationPage;
