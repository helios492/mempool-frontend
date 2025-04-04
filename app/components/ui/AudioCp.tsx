"use client";

import React from "react";

interface AudioCpProps {
  source: string;
}

const AudioCp: React.FC<AudioCpProps> = ({ source }) => {
  return (
    <audio className="block w-full max-w-md mx-auto" controls>
      <source src={source} type="audio/mp3" />
    </audio>
  );
};

export default AudioCp;
