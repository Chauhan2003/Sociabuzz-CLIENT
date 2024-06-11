import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setUserProfile } from "../redux/userSlice";
import { userAPI } from "../routes";

const useUpdateUserProfile = () => {
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const { authUser } = useSelector(store => store.user);
	const dispatch = useDispatch();

	const updateProfile = async (formData) => {
		setIsUpdatingProfile(true);
		try {
			const res = await axios.post(`${userAPI}/update`, formData);
			dispatch(setUserProfile(res.data));
			const updatedUser = {
				fullName: res.data.user.fullName,
				username: res.data.user.username,
				email: res.data.user.email,
				followers: res.data.user.followers,
				following: res.data.user.following,
				profileImg: res.data.user.profileImg,
				coverImg: res.data.user.coverImg
			}

			dispatch(setAuthUser({ ...authUser, ...updatedUser }))
			toast.success("Profile updated successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to update profile");
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;