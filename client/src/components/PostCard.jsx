// import { BadgeCheck, Heart, MessageCircle, Share2, Bookmark, ThumbsUp, Laugh, Frown, Angry, Send, MoreHorizontal, X, Reply, Smile } from 'lucide-react'
// import React, { useState, useRef } from 'react'
// import moment from 'moment'
// import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from "react-redux"
// import toast from 'react-hot-toast'
// import api, { BASE_URL } from '../api/axios'
// import { motion, AnimatePresence } from 'framer-motion'
// import { toggleLikePost } from '../features/posts/postSlice' // assuming we create this

// const PostCard = ({ post }) => {

//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const postsWithHastags = post.content.replace(/(#\w+)/g, "<span class='text-indigo-600'>$1</span>")

//   const [likes, setLikes] = useState(post.likes || [])
//   const [comments, setComments] = useState(post.comments || [])
//   const [showComments, setShowComments] = useState(false)
//   const [newComment, setNewComment] = useState('')
//   const [showReactions, setShowReactions] = useState(false)
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [showImageModal, setShowImageModal] = useState(false)
//   const [replyingTo, setReplyingTo] = useState(null)
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)
//   const currentUser = useSelector((state) => state.user.value);
//   const commentInputRef = useRef(null)

//   const handleLike = async () => {
//     if (!currentUser) return
//     try {
//       const { data } = await api.post("/api/post/toggle-like", { postId: post._id })

//       if (data.success) {
//         setLikes(prev => {
//           if (prev.includes(currentUser._id)) {
//             return prev.filter((id) => id !== currentUser._id)
//           } else {
//             return [...prev, currentUser._id]
//           }
//         })
//       } else {
//         toast.error(data.message)
//       }

//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const handleDoubleClickLike = () => {
//     if (currentUser && !likes.includes(currentUser._id)) {
//       handleLike()
//     }
//   }

//   const handleSave = async () => {
//     try {
//       const { data } = await api.post("/api/post/save", { postId: post._id })
//       if (data.success) {
//         toast.success('Post saved')
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const handleComment = async (e) => {
//     e.preventDefault()
//     if (!newComment.trim()) return

//     try {
//       const commentData = {
//         postId: post._id,
//         content: newComment
//       }

//       if (replyingTo) {
//         commentData.parentCommentId = replyingTo
//       }

//       const { data } = await api.post("/api/post/comment", commentData)
//       if (data.success) {
//         setComments(prev => [...prev, data.comment])
//         setNewComment('')
//         setReplyingTo(null)
//         toast.success('Comment added!')
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error('Failed to add comment')
//     }
//   }

//   const handleReply = (commentId, username) => {
//     setReplyingTo(commentId)
//     setNewComment(`@${username} `)
//     commentInputRef.current?.focus()
//   }

//   const addEmoji = (emoji) => {
//     setNewComment(prev => prev + emoji)
//     setShowEmojiPicker(false)
//   }

//   const handleReaction = async (reactionType) => {
//     try {
//       const { data } = await api.post("/api/post/react", {
//         postId: post._id,
//         reaction: reactionType
//       })
//       if (data.success) {
//         // Update reactions in state
//         setShowReactions(false)
//         toast.success(`Reacted with ${reactionType}!`)
//       }
//     } catch (error) {
//       toast.error('Failed to react')
//     }
//   }

//   const handleShare = async () => {
//     try {
//       await navigator.share({
//         title: 'Check out this post',
//         text: post.content,
//         url: window.location.href
//       })
//     } catch (error) {
//       // Fallback for browsers that don't support Web Share API
//       navigator.clipboard.writeText(window.location.href)
//       toast.success('Link copied to clipboard!')
//     }
//   }

//   const nextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === post.image_urls.length - 1 ? 0 : prev + 1
//     )
//   }

//   const prevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? post.image_urls.length - 1 : prev - 1
//     )
//   }


//   return (
//     <motion.div
//       className='w-full max-w-2xl p-3 space-y-3 transition-all duration-300 bg-white border border-gray-200 shadow-lg dark:bg-slate-800 rounded-xl hover:shadow-xl md:p-4 md:space-y-4 dark:border-slate-700 mobile-fix'
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       whileHover={{ y: -2 }}
//     >
//       {/* Debug: Add visible content */}
//       <div className="text-black dark:text-white">Post Card</div>
//       {/* User Details */}
//       <motion.div
//         onClick={() => navigate("/profile/" + (post?.user?._id || post.user))}
//         className='inline-flex items-center gap-3 cursor-pointer group touch-manipulation'
//         whileHover={{ scale: 1.02 }}
//         transition={{ type: "spring", stiffness: 400, damping: 10 }}
//       >
//         <motion.img
//           src={post?.user._id === currentUser?._id
//             ? (currentUser?.profile_picture.startsWith('/') ? `${BASE_URL}${currentUser?.profile_picture}` : currentUser?.profile_picture)
//             : (post?.user.profile_picture.startsWith('/') ? `${BASE_URL}${post?.user.profile_picture}` : post?.user.profile_picture)}
//           className='object-cover w-10 h-10 border-2 border-white rounded-full shadow-md dark:border-slate-600'
//           whileHover={{ scale: 1.1 }}
//           transition={{ type: "spring", stiffness: 400, damping: 10 }}
//         />
//         <div>
//           <div className='flex items-center space-x-1'>
//             <span className='text-sm font-semibold text-gray-800 transition-colors dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 md:text-base'>
//               {post?.user.full_name}
//             </span>
//             <BadgeCheck className='w-4 h-4 text-blue-500' />
//           </div>
//           <div className='text-xs text-gray-500 md:text-sm dark:text-gray-400'>
//             @{post?.user.username} ● {moment(post.createdAt).fromNow()}
//           </div>
//         </div>
//       </motion.div>

//       {/* User content */}
//       {post.content && (
//         <motion.div
//           className='text-sm leading-relaxed text-gray-800 whitespace-pre-line dark:text-gray-200 md:text-base'
//           dangerouslySetInnerHTML={{ __html: postsWithHastags }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.1 }}
//         />
//       )}

//       {/* Images */}
//       <motion.div
//         className='relative'
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         onDoubleClick={handleDoubleClickLike}
//       >
//         {post.image_urls && post.image_urls.length > 0 && (
//           <div className='relative overflow-hidden rounded-lg'>
//             {/* Main Image Display */}
//             <motion.div
//               className='relative cursor-pointer aspect-square md:aspect-video'
//               onClick={() => setShowImageModal(true)}
//               whileHover={{ scale: 1.02 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             >
//               <motion.img
//                 src={post.image_urls[currentImageIndex]}
//                 className='object-cover w-full h-full'
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 key={currentImageIndex}
//               />

//               {/* Image Navigation Dots */}
//               {post.image_urls.length > 1 && (
//                 <div className='absolute flex gap-2 transform -translate-x-1/2 bottom-2 left-1/2'>
//                   {post.image_urls.map((_, index) => (
//                     <motion.button
//                       key={index}
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         setCurrentImageIndex(index)
//                       }}
//                       className={`w-2 h-2 rounded-full transition-colors ${
//                         index === currentImageIndex ? 'bg-white' : 'bg-white/50'
//                       }`}
//                       whileHover={{ scale: 1.2 }}
//                       whileTap={{ scale: 0.9 }}
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Image Navigation Arrows */}
//               {post.image_urls.length > 1 && (
//                 <>
//                   <motion.button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       prevImage()
//                     }}
//                     className='absolute flex items-center justify-center w-8 h-8 text-white transition-colors transform -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70'
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     ‹
//                   </motion.button>
//                   <motion.button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       nextImage()
//                     }}
//                     className='absolute flex items-center justify-center w-8 h-8 text-white transition-colors transform -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70'
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     ›
//                   </motion.button>
//                 </>
//               )}
//             </motion.div>

//             {/* Image Counter */}
//             {post.image_urls.length > 1 && (
//               <div className='absolute px-2 py-1 text-xs font-medium text-white rounded-full top-2 right-2 bg-black/50'>
//                 {currentImageIndex + 1}/{post.image_urls.length}
//               </div>
//             )}
//           </div>
//         )}
//       </motion.div>
//       {/* Tagged Users */}
//       {post.tagged_users && post.tagged_users.length > 0 && (
//         <div className='text-sm text-gray-600'>
//           Tagged: {post.tagged_users.map(u => u.username).join(', ')}
//         </div>
//       )}

//       {/* Post Analytics */}
//       <motion.div
//         className='flex items-center justify-between pt-2 pb-2 text-xs text-gray-500 border-b border-gray-100 dark:text-gray-400 dark:border-slate-700'
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.25 }}
//       >
//         <span>{post.views || 0} views</span>
//         <span>{post.impressions || 0} impressions</span>
//         <span>{Math.round((post.likes?.length || 0) / Math.max(post.views || 1, 1) * 100)}% engagement</span>
//       </motion.div>

//       {/* LinkedIn-style Actions */}
//       <motion.div
//         className='flex items-center justify-between pt-3 text-sm text-gray-600 border-t border-gray-200 dark:text-gray-400 dark:border-slate-600'
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//       >
//         {/* Like Button with Reactions */}
//         <div className='relative'>
//           <motion.div
//             onClick={handleLike}
//             className='flex items-center gap-2 px-3 py-2 transition-colors rounded-lg cursor-pointer group touch-manipulation hover:bg-gray-50 dark:hover:bg-slate-700'
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onHoverStart={() => setShowReactions(true)}
//             onHoverEnd={() => setShowReactions(false)}
//           >
//             <motion.div
//               animate={{
//                 scale: currentUser && likes.includes(currentUser._id) ? [1, 1.2, 1] : 1,
//                 rotate: currentUser && likes.includes(currentUser._id) ? [0, 10, -10, 0] : 0
//               }}
//               transition={{ duration: 0.3 }}
//             >
//               <Heart
//                 className={`w-5 h-5 transition-all duration-200 ${
//                   currentUser && likes.includes(currentUser._id)
//                     ? "text-red-500 fill-red-500"
//                     : "group-hover:text-red-400"
//                 }`}
//               />
//             </motion.div>
//             <span className='font-medium'>{likes.length}</span>
//           </motion.div>

//           {/* Reaction Picker */}
//           <AnimatePresence>
//             {showReactions && (
//               <motion.div
//                 className='absolute left-0 flex gap-1 p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full dark:bg-slate-800 dark:border-slate-600'
//                 initial={{ opacity: 0, scale: 0.8, y: 10 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.8, y: 10 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {[
//                   { icon: ThumbsUp, color: 'text-blue-500', type: 'like' },
//                   { icon: Heart, color: 'text-red-500', type: 'love' },
//                   { icon: Laugh, color: 'text-yellow-500', type: 'laugh' },
//                   { icon: Frown, color: 'text-orange-500', type: 'sad' },
//                   { icon: Angry, color: 'text-red-600', type: 'angry' }
//                 ].map(({ icon: Icon, color, type }) => (
//                   <motion.button
//                     key={type}
//                     onClick={() => handleReaction(type)}
//                     className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${color}`}
//                     whileHover={{ scale: 1.2 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <Icon className='w-5 h-5' />
//                   </motion.button>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Comments Button */}
//         <motion.div
//           onClick={() => {
//             setShowComments(!showComments)
//             if (!showComments) {
//               setTimeout(() => commentInputRef.current?.focus(), 100)
//             }
//           }}
//           className='flex items-center gap-2 px-3 py-2 transition-colors rounded-lg cursor-pointer group touch-manipulation hover:bg-gray-50 dark:hover:bg-slate-700'
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <MessageCircle className="w-5 h-5 transition-colors group-hover:text-blue-500" />
//           <span className='font-medium'>{comments.length}</span>
//         </motion.div>

//         {/* Share Button */}
//         <motion.div
//           onClick={handleShare}
//           className='flex items-center gap-2 px-3 py-2 transition-colors rounded-lg cursor-pointer group touch-manipulation hover:bg-gray-50 dark:hover:bg-slate-700'
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Share2 className="w-5 h-5 transition-colors group-hover:text-green-500" />
//           <span className='font-medium'>Share</span>
//         </motion.div>

//         {/* Save Button */}
//         <motion.div
//           onClick={handleSave}
//           className='flex items-center gap-2 px-3 py-2 transition-colors rounded-lg cursor-pointer group touch-manipulation hover:bg-gray-50 dark:hover:bg-slate-700'
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Bookmark className="w-5 h-5 transition-colors group-hover:text-blue-500" />
//           <span className='font-medium'>Save</span>
//         </motion.div>
//       </motion.div>

//       {/* Comments Section */}
//       <AnimatePresence>
//         {showComments && (
//           <motion.div
//             className='pt-4 border-t border-gray-200 dark:border-slate-600'
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             {/* Comment Input */}
//             <form onSubmit={handleComment} className='flex gap-3 mb-4'>
//               <img
//                 src={currentUser?.profile_picture}
//                 alt='Your avatar'
//                 className='flex-shrink-0 object-cover w-8 h-8 rounded-full'
//               />
//               <div className='flex flex-1 gap-2'>
//                 <div className='relative flex-1'>
//                   <input
//                     ref={commentInputRef}
//                     type='text'
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
//                     className='flex-1 pr-8 text-sm modern-input'
//                   />
//                   <motion.button
//                     type='button'
//                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                     className='absolute p-1 text-gray-400 transition-colors transform -translate-y-1/2 right-2 top-1/2 hover:text-primary'
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <Smile className='w-4 h-4' />
//                   </motion.button>
//                 </div>
//                 <motion.button
//                   type='submit'
//                   className='p-2 transition-colors text-primary hover:text-primary/80'
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   disabled={!newComment.trim()}
//                 >
//                   <Send className='w-4 h-4' />
//                 </motion.button>
//               </div>
//             </form>

//             {/* Emoji Picker */}
//             <AnimatePresence>
//               {showEmojiPicker && (
//                 <motion.div
//                   className='p-3 mb-4 rounded-lg bg-gray-50 dark:bg-slate-700'
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <div className='flex flex-wrap gap-2'>
//                     {['😀', '😂', '❤️', '👍', '👎', '😢', '😮', '🙌', '🔥', '💯'].map((emoji) => (
//                       <motion.button
//                         key={emoji}
//                         onClick={() => addEmoji(emoji)}
//                         className='p-1 text-lg transition-colors rounded hover:bg-gray-200 dark:hover:bg-slate-600'
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         {emoji}
//                       </motion.button>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Comments List */}
//             <div className='space-y-3 overflow-y-auto max-h-60'>
//               {comments.map((comment, index) => (
//                 <motion.div
//                   key={comment._id || index}
//                   className={`${comment.parentCommentId ? 'ml-12' : ''}`}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <div className='flex gap-3'>
//                     <img
//                       src={comment.user?.profile_picture.startsWith('/') ? `${BASE_URL}${comment.user?.profile_picture}` : comment.user?.profile_picture}
//                       alt={comment.user?.full_name}
//                       className='flex-shrink-0 object-cover w-8 h-8 rounded-full'
//                     />
//                     <div className='flex-1'>
//                       <div className='px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-700'>
//                         <div className='flex items-center gap-2 mb-1'>
//                           <span className='text-sm font-medium text-text-primary'>
//                             {comment.user?.full_name}
//                           </span>
//                           <span className='text-xs text-text-secondary'>
//                             {moment(comment.createdAt).fromNow()}
//                           </span>
//                         </div>
//                         <p className='text-sm text-text-primary'>{comment.content}</p>
//                       </div>
//                       {/* Reply Button */}
//                       <motion.button
//                         onClick={() => handleReply(comment._id, comment.user?.username)}
//                         className='mt-1 text-xs transition-colors text-primary hover:text-primary/80'
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         Reply
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }

// export default PostCard



import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Video,
  FileText,
  BarChart3,
  MapPin,
  Music,
  Users,
  Calendar,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Eye,
} from "lucide-react";

import React, { useState, useRef } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api, { BASE_URL } from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  PollSection,
  ArticleSection,
  DocumentSection,
  CollaborationSection,
} from "./PostMediaComponents";

const DEFAULT_AVATAR = "/default-avatar.png";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.value);

  const postsWithHashtags =
    post?.content?.replace(
      /(^|\s)(#\w+)/g,
      '$1<span class="text-indigo-600 font-semibold">$2</span>'
    ) || "";

  const [likes, setLikes] = useState(post?.likes || []);
  const [comments, setComments] = useState(post?.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [pollOptions, setPollOptions] = useState(post?.poll_options || []);

  const commentInputRef = useRef(null);

  const isSponsored = post?.type === "sponsored";

  const safePostId = isSponsored ? null : post?._id;

  const getImageURL = (img) => {
    if (!img) return DEFAULT_AVATAR;
    if (img.startsWith("http")) return img; // Already full URL (ImageKit)
    if (img.startsWith("/")) {
      // Local server path - construct full URL
      const baseURL = BASE_URL.replace("/api", "");
      return baseURL + img;
    }
    return img;
  };

  const getVideoURL = (video) => {
    if (!video) return null;
    if (video.startsWith("http")) return video; // Already full URL (ImageKit)
    if (video.startsWith("/")) {
      // Local server path - construct full URL
      const baseURL = BASE_URL.replace("/api", "");
      return baseURL + video;
    }
    return video;
  };

  const userObj =
    typeof post?.user === "object"
      ? post.user
      : { _id: post?.user, full_name: "User", username: "unknown" };

  // DISABLE ALL CLICK EVENTS FOR SPONSORED POSTS
  const blockSponsored = () => {
    if (isSponsored) {
      toast.error("Sponsored posts cannot be interacted with");
      return true;
    }
    return false;
  };

  const handleLike = async () => {
    if (blockSponsored()) return;

    try {
      const { data } = await api.post("/post/toggle-like", {
        postId: safePostId,
      });

      if (data.success) {
        setLikes((prev) =>
          prev.includes(currentUser._id)
            ? prev.filter((id) => id !== currentUser._id)
            : [...prev, currentUser._id]
        );
      }
    } catch {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (blockSponsored()) return;

    if (!newComment.trim()) return;

    try {
      const payload = {
        postId: safePostId,
        content: newComment,
      };

      if (replyingTo) payload.parentCommentId = replyingTo;

      const { data } = await api.post("/post/comment", payload);

      if (data.success) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
        setReplyingTo(null);
      }
    } catch {
      toast.error("Failed to comment");
    }
  };

  const voteOnPoll = async (optionIndex) => {
    if (blockSponsored()) return;

    try {
      const { data } = await api.post("/post/vote", {
        postId: safePostId,
        optionIndex,
      });

      if (data.success) {
        setPollOptions(data.pollOptions);
        toast.success("Vote recorded!");
      }
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleShare = () => {
    if (blockSponsored()) return;

    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <motion.div
      className="w-full max-w-2xl p-3 space-y-4 bg-white border border-gray-200 shadow-lg md:p-4 dark:bg-slate-800 dark:border-slate-700 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* USER INFO */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => !isSponsored && navigate("/profile/" + userObj._id)}
      >
        <img
          src={getImageURL(userObj.profile_picture)}
          className="object-cover w-10 h-10 border border-gray-300 rounded-full"
        />

        <div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-800 dark:text-white">
              {userObj.full_name}
            </span>
            {!isSponsored && <BadgeCheck className="w-4 text-blue-500" />}
          </div>

          <div className="text-xs text-gray-500">
            @{userObj.username} • {moment(post?.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* CAPTION */}
      {post?.content && (
        <div
          className="text-sm md:text-base dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: postsWithHashtags }}
        />
      )}

      {/* MEDIA CONTENT BASED ON POST TYPE */}
      {(() => {
        const postType = post?.post_type || "text";

        // Always show images if they exist, regardless of post type
        if (Array.isArray(post?.image_urls) && post.image_urls.length > 0) {
          if (postType === "carousel") {
            return <Carousel images={post.image_urls.map(img => getImageURL(img))} />;
          } else {
            return (
              <div className="relative">
                <div className="w-full h-[350px] md:h-[500px] bg-black rounded-xl overflow-hidden">
                  <img
                    src={getImageURL(post.image_urls[0])}
                    className="object-cover w-full h-full"
                    alt="Post image"
                  />
                </div>
              </div>
            );
          }
        }

        switch (postType) {
          case "video":
            return post?.video_url ? (
              <div className="relative">
                <div className="w-full h-[350px] md:h-[500px] bg-black rounded-xl overflow-hidden">
                  <video
                    controls
                    className="object-cover w-full h-full"
                    poster={post.image_urls?.[0] ? getImageURL(post.image_urls[0]) : undefined}
                  >
                    <source src={getVideoURL(post.video_url)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ) : null;

          case "poll":
            return (
              <PollSection
                pollOptions={pollOptions}
                onVote={voteOnPoll}
                postId={safePostId}
                isSponsored={isSponsored}
              />
            );

          case "article":
            return post?.is_article ? (
              <ArticleSection content={post.content} />
            ) : null;

          case "pdf":
            return Array.isArray(post?.documents) && post.documents.length > 0 ? (
              <DocumentSection documents={post.documents} />
            ) : null;

          case "collab":
            return (
              <CollaborationSection
                collabUsers={post.collab_users}
                content={post.content}
              />
            );

          default:
            return null;
        }
      })()}

      {/* ACTIONS */}
      <div className="flex items-center justify-between pt-2 border-t dark:border-slate-600">
        <div onClick={handleLike} className="flex items-center gap-2 cursor-pointer">
          <Heart
            className={`w-5 ${
              likes.includes(currentUser?._id)
                ? "text-red-500 fill-red-500"
                : ""
            }`}
          />
          <span>{likes.length}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => !isSponsored && setShowComments((v) => !v)}
        >
          <MessageCircle className="w-5" />
          <span>{comments.length}</span>
        </div>

        <div
          onClick={handleShare}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="w-5" />
        </div>

        <div onClick={() => toast.success("Saved")} className="cursor-pointer">
          <Bookmark className="w-5" />
        </div>
      </div>

      {/* COMMENTS */}
      {!isSponsored && (
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 space-y-4"
            >
              <form onSubmit={handleComment} className="flex items-center gap-2">
                <img
                  src={getImageURL(currentUser?.profile_picture)}
                  className="w-8 h-8 rounded-full"
                />

                <input
                  ref={commentInputRef}
                  className="flex-1 modern-input"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button type="submit">
                  <Send className="w-5 text-primary" />
                </button>
              </form>

              {comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <img
                    src={getImageURL(c.user?.profile_picture)}
                    className="w-8 h-8 rounded-full"
                  />

                  <div className="flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg dark:bg-slate-700">
                      <strong>{c.user?.full_name}</strong>
                      <p>{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default PostCard;
