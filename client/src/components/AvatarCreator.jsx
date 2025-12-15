import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';

const AvatarCreator = ({ onSave, onCancel }) => {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2);
  const editorRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        onSave(blob);
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Create Avatar</h3>

      {!image ? (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={200}
            height={200}
            border={50}
            borderRadius={100}
            scale={scale}
            rotate={0}
          />

          <div className="flex flex-col items-center gap-2">
            <label className="text-sm">Zoom: {scale.toFixed(1)}</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Avatar
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarCreator;
