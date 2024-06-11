import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "../../redux/userSlice";
import UserSuggestion from "./UserSuggestion";

const RightPanel = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const { suggestedUsers } = useSelector(store => store.user);

	useEffect(() => {
		setIsLoading(true);
		const fetchSuggestedUser = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/users/suggested`);
				dispatch(setSuggestedUsers(res.data));
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchSuggestedUser();
	}, []);

	// if (suggestedUsers?.length === 0) return <div className='md:w-[300px] w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2 w-[300px]'>
			<div className='bg-[#16181C] p-3 rounded-md sticky top-2'>
				<p className='font-bold mb-4'>Suggested Users</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}

					{
						!isLoading && suggestedUsers?.length === 0 ? <div className="text-center text-sm">No user found</div> : suggestedUsers?.map((user) => (
							<UserSuggestion user={user} key={user._id} />
						))
					}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
