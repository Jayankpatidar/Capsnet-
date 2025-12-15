import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ProfileQRCode = ({ userId }) => {
  const profileUrl = `${window.location.origin}/profile/${userId}`;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900">Profile QR Code</h3>
      <p className="mb-4 text-sm text-center text-gray-600">
        Scan this QR code to view this profile
      </p>
      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
        <QRCodeSVG
          value={profileUrl}
          size={200}
          level="M"
          includeMargin={true}
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-gray-500">Or share this link:</p>
        <p className="p-2 font-mono text-sm break-all bg-gray-100 rounded">
          {profileUrl}
        </p>
      </div>
    </div>
  );
};

export default ProfileQRCode;
