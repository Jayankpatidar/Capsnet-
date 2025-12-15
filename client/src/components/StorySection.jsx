import { useState } from "react";
import StoryViewer from "./StoryViewer";

export default function StorySection({ stories }) {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <>
      {/* STORY LIST */}
      <div className="flex gap-4 p-4">
        {stories.map((story) => (
          <div
            key={story._id}
            className="text-center cursor-pointer"
            onClick={() => setActiveStory(story)}
          >
            <img
              src={story.user.avatar}
              className="w-16 h-16 border-2 border-pink-500 rounded-full"
            />
            <p className="mt-1 text-xs text-gray-400">
              {story.time}
            </p>
          </div>
        ))}
      </div>

      {/* SINGLE STORY VIEWER */}
      {activeStory && (
        <StoryViewer
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}
    </>
  );
}
