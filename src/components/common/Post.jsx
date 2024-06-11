import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { formatPostDate } from "../../utils/date";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllPosts } from "../../redux/postSlice";
import { setUserProfile } from "../../redux/userSlice";
import { postAPI } from "../../routes";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const [isLiking, setIsLiking] = useState(false);
	const { allPosts } = useSelector((store) => store.post);
	const { authUser, userProfile } = useSelector((store) => store.user);
	const postOwner = post.user;
	const dispatch = useDispatch();

	// Ensure post.likes is always an array
	const postLikes = post.likes || [];
	const isLiked = postLikes?.includes(authUser?._id);
	let isMyPost = authUser?._id === postOwner?._id;

	const formattedDate = formatPostDate(post?.createdAt);

	const handleDeletePost = async () => {
		setIsDeleting(true);
		try {
			await axios.delete(`${postAPI}/${post?._id}`);
			const updatedAllPosts = allPosts?.filter((p) => p?._id !== post?._id);
			dispatch(setAllPosts(updatedAllPosts));
			toast.success("Post deleted successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete post");
		} finally {
			setIsDeleting(false);
		}
	};

	const handlePostComment = async (e) => {
		e.preventDefault();
		setIsCommenting(true);
		try {
			const res = await axios.post(`${postAPI}/comment/${post?._id}`, { text: comment });
			const updatedPost = { ...post, comments: res.data };
			const updatedAllPosts = allPosts.map((p) => (p?._id === post?._id ? updatedPost : p));
			dispatch(setAllPosts(updatedAllPosts));

			// Update userProfile.posts
			const updatedUserProfilePosts = userProfile?.posts.map((p) => (p?._id === post?._id ? updatedPost : p));
			dispatch(setUserProfile({ ...userProfile, posts: updatedUserProfilePosts }));

			toast.success("Comment posted successfully");
			setComment("");
		} catch (err) {
			console.error(err);
			toast.error("Failed to post comment");
		} finally {
			setIsCommenting(false);
		}
	};

	const handleLikePost = async () => {
		setIsLiking(true);
		try {
			const res = await axios.post(`${postAPI}/like/${post?._id}`);
			const updatedPost = { ...post, likes: res.data };
			const updatedAllPosts = allPosts.map((p) => (p?._id === post?._id ? updatedPost : p));
			dispatch(setAllPosts(updatedAllPosts));

			// Update userProfile.posts
			const updatedUserProfilePosts = userProfile?.posts.map((p) => (p?._id === post?._id ? updatedPost : p));
			dispatch(setUserProfile({ ...userProfile, posts: updatedUserProfilePosts }));
		} catch (err) {
			console.error(err);
			toast.error("Failed to like post");
		} finally {
			setIsLiking(false);
		}
	};

	return (
		<div className="flex gap-2 items-start p-4 border-b border-gray-700">
			<div className="avatar">
				<Link to={`/profile/${postOwner?.username}`} className="w-10 h-10 rounded-full overflow-hidden">
					<img src={postOwner?.profileImg || "/avatar-placeholder.png"} alt={postOwner?.fullName} />
				</Link>
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex gap-2 items-center">
					<Link to={`/profile/${postOwner?.username}`} className="font-bold">
						{postOwner?.fullName}
					</Link>
					<span className="text-gray-700 flex gap-1 text-sm">
						<Link to={`/profile/${postOwner?.username}`}>@{postOwner?.username}</Link>
						<span>·</span>
						<span>{formattedDate}</span>
					</span>
					{isMyPost && (
						<span className="flex justify-end flex-1">
							{!isDeleting && (
								<FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />
							)}
							{isDeleting && <LoadingSpinner size="sm" />}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-3 overflow-hidden">
					<span>{post?.text}</span>
					{post?.image && (
						<img
							src={post?.image}
							className="h-80 object-contain rounded-lg border border-gray-700"
							alt=""
						/>
					)}
				</div>
				<div className="flex justify-between mt-3">
					<div className="flex gap-4 items-center w-2/3 justify-between">
						<div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
							{isLiking && <LoadingSpinner size="sm" />}
							{!isLiked && !isLiking && (
								<FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
							)}
							{isLiked && !isLiking && (
								<FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
							)}
							<span
								className={`text-sm group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500"}`}
							>
								{postLikes?.length}
							</span>
						</div>
						<div
							className="flex gap-1 items-center cursor-pointer group"
							onClick={() => document.getElementById("comments_modal" + post?._id).showModal()}
						>
							<FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
							<span className="text-sm text-slate-500 group-hover:text-sky-400">
								{post?.comments?.length}
							</span>
						</div>
						<dialog id={`comments_modal${post?._id}`} className="modal border-none outline-none">
							<div className="modal-box rounded border border-gray-600 relative">
								<h3 className="font-bold text-lg mb-4">COMMENTS</h3>
								<div className="flex flex-col gap-3 max-h-60 overflow-auto">
									{post?.comments?.length === 0 && (
										<p className="text-sm text-slate-500">No comments yet 🤔 Be the first one 😉</p>
									)}
									{
										post?.comments?.map((comment) => {
											return (
												<div key={comment?._id} className="flex gap-2 items-start">
													<div className="avatar">
														<div className="w-8 rounded-full">
															<img src={comment?.user?.profileImg || "/avatar-placeholder.png"} alt={comment?.user?.fullName} />
														</div>
													</div>
													<div className="flex flex-col">
														<div className="flex items-center gap-1">
															<span className="font-bold">{comment?.user?.fullName}</span>
															<span className="text-gray-700 text-sm">@{comment?.user?.username}</span>
														</div>
														<div className="text-sm">{comment?.text}</div>
													</div>
												</div>
											)
										})
									}
								</div>
								<form className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2" onSubmit={handlePostComment}>
									<textarea
										className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
										placeholder="Add a comment..."
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<button className="btn btn-primary rounded-full btn-sm text-white px-4" disabled={isCommenting}>
										{isCommenting ? <LoadingSpinner size="md" /> : "Post"}
									</button>
								</form>
								<form method="dialog" className="modal-backdrop absolute top-2 right-2">
									<button className="outline-none text-white"><IoIosCloseCircleOutline className="w-7 h-7" /></button>
								</form>
							</div>
						</dialog>
						<div className="flex gap-1 items-center group cursor-pointer">
							<BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
							<span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
						</div>
					</div>
					<div className="flex gap-1 items-center group cursor-pointer">
						<FaRegBookmark className="w-4 h-4 text-slate-500 group-hover:text-yellow-500" />
					</div>
				</div>
			</div >
		</div >
	);
};

export default Post;