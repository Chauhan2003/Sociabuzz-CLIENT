import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { formatMemberSinceDate } from "../../utils/date";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { setUserProfile, setAuthUser, setSuggestedUsers } from "../../redux/userSlice";
import PostsProfile from "../../components/common/PostsProfile";
import { userAPI } from "../../routes";

const ProfilePage = () => {
	const dispatch = useDispatch();
	const { authUser, userProfile, suggestedUsers } = useSelector((store) => store.user);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const navigate = useNavigate();

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const { username } = useParams();
	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	useEffect(() => {
		const fetchUserProfile = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get(`${userAPI}/profile/${username}`);
				const { user, posts } = res.data;
				dispatch(setUserProfile({ user, posts }));
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProfile();
	}, [username, dispatch, authUser]);

	const renderUserDetails = () => {
		return (
			<div className="flex flex-col gap-4 mt-10 px-4 pb-4 border-b border-gray-700">
				<div className="flex flex-col">
					<span className="font-bold text-lg">{userProfile?.user?.fullName}</span>
					<span className="text-sm text-slate-500">@{userProfile?.user?.username}</span>
					<span className="text-sm my-1">{userProfile?.user?.bio}</span>
				</div>
				<div className="flex gap-2 flex-wrap">
					{userProfile?.user?.link && (
						<div className="flex gap-1 items-center">
							<FaLink className="w-3 h-3 text-slate-500" />
							<a
								href={userProfile?.user?.link}
								target="_blank"
								rel="noreferrer"
								className="text-sm text-blue-500 hover:underline"
							>
								{userProfile?.user?.link}
							</a>
						</div>
					)}
					<div className="flex gap-2 items-center">
						<IoCalendarOutline className="w-4 h-4 text-slate-500" />
						<span className="text-sm text-slate-500">{formatMemberSinceDate(userProfile?.user?.createdAt)}</span>
					</div>
				</div>
				<div className="flex gap-2">
					<div className="flex gap-1 items-center">
						<span className="font-bold text-xl">{userProfile?.user?.following?.length || 0}</span>
						<span className="text-slate-500 text-sm">Following</span>
					</div>
					<div className="flex gap-1 items-center">
						<span className="font-bold text-xl">{userProfile?.user?.followers?.length || 0}</span>
						<span className="text-slate-500 text-sm">Followers</span>
					</div>
				</div>
			</div>
		);
	};

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (state === "coverImg") setCoverImg(reader.result);
				if (state === "profileImg") setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const follow = async (userId) => {
		setIsPending(true);
		try {
			await axios.post(`${userAPI}/follow/${userId}`);
			// Optimistically update UI
			dispatch(setUserProfile({ ...userProfile, user: { ...userProfile?.user, followers: [...userProfile?.user?.followers, authUser?._id] } }));
			// Update authUser's following list
			dispatch(setAuthUser({ ...authUser, following: [...authUser?.following, userId] }));

			// Update suggested users list
			const updatedSuggestedUsers = suggestedUsers?.filter((suggestedUser) => suggestedUser?._id !== userId);
			dispatch(setSuggestedUsers(updatedSuggestedUsers));
		} catch (err) {
			console.error(err);
		} finally {
			setIsPending(false);
		}
	};

	const unfollow = async (userId) => {
		setIsPending(true);
		try {
			await axios.post(`${userAPI}/unfollow/${userId}`);
			// Optimistically update UI
			const updatedFollowers = userProfile?.user?.followers?.filter(id => id !== authUser?._id);
			dispatch(setUserProfile({ ...userProfile, user: { ...userProfile?.user, followers: updatedFollowers } }));
			// Update authUser's following list
			const updatedFollowing = authUser?.following?.filter(id => id !== userId);
			dispatch(setAuthUser({ ...authUser, following: updatedFollowing }));
		} catch (err) {
			console.error(err);
		} finally {
			setIsPending(false);
		}
	};

	const handleUpdateProfile = async () => {
		await updateProfile({ coverImg, profileImg });
		setProfileImg(null);
		setCoverImg(null);
	};

	const handleGoBack = () => {
		navigate(-1);
	}
	return (
		<>
			<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
				{isLoading && <ProfileHeaderSkeleton />}
				{!isLoading && !userProfile && <p className="text-center text-lg mt-4">User not found</p>}
				<div className="flex flex-col">
					{!isLoading && userProfile && (
						<>
							<div className="flex gap-8 px-4 py-2 items-center">
								<div onClick={handleGoBack}>
									<FaArrowLeft className="w-5 h-5 cursor-pointer" />
								</div>
								<div className="flex flex-col">
									<p className="font-bold text-lg">{userProfile?.user?.fullName}</p>
									{
										userProfile?.posts?.length != 0 ? <span className="text-sm text-slate-500">{userProfile?.posts?.length} posts</span> : null
									}
								</div>
							</div>
							<div className="relative group/cover">
								<div>
									<div className="w-full rounded-full relative group/avatar">
										<img
											src={coverImg || userProfile?.user?.coverImg || "/cover.png"}
											className="h-52 w-full object-cover"
											alt="cover image"
										/>
										{authUser?._id === userProfile?.user?._id && (
											<div className="absolute top-3 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
												<MdEdit
													className="w-4 h-4 text-white"
													onClick={() => coverImgRef.current.click()}
												/>
											</div>
										)}
									</div>
								</div>
								<input
									type="file"
									hidden
									accept="image/*"
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type="file"
									hidden
									accept="image/*"
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								<div className="avatar absolute top-[130px] left-4 p-1 bg-black rounded-full">
									<div className="w-36 h-36 rounded-full relative group/avatar">
										<img
											src={profileImg || userProfile?.user?.profileImg || "/avatar-placeholder.png"}
											alt="profile"
										/>
										{authUser?._id === userProfile?.user?._id && (
											<div className="absolute top-4 right-4 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
												<MdEdit
													className="w-4 h-4 text-white"
													onClick={() => profileImgRef.current.click()}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="flex justify-end px-4 mt-4">
								{authUser?._id === userProfile?.user?._id && <EditProfileModal authUser={authUser} />}
								{authUser?._id !== userProfile?.user?._id && (
									<button
										className="btn btn-outline rounded-full btn-sm"
										onClick={() => {
											if (isPending) return;
											if (authUser?.following.includes(userProfile?.user?._id)) {
												unfollow(userProfile?.user?._id);
											} else {
												follow(userProfile?.user?._id);
											}
										}}
										disabled={isPending}
									>
										{isPending ? "Loading..." : authUser?.following?.includes(userProfile?.user?._id) ? "Unfollow" : "Follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
										onClick={handleUpdateProfile}
										disabled={isUpdatingProfile}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>
							{renderUserDetails()}
							{userProfile?.posts?.length === 0 && (
								<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
							)}
							<PostsProfile posts={userProfile?.posts} />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
