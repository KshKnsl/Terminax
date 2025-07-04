const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center text-center transform-translate-y-1/4">
        <svg width="60" height="60" viewBox="0 0 50 50">
          <g fill="none" stroke="#8B5CF6" strokeWidth="2">
            <polygon points="25,10 40,20 40,35 25,45 10,35 10,20">
              <animate
                attributeName="stroke-dasharray"
                values="0,120;120,0;0,120"
                dur="2s"
                repeatCount="indefinite"></animate>
            </polygon>
            <circle cx="25" cy="27" r="5">
              <animate attributeName="r" values="5;4;5" dur="1s" repeatCount="indefinite"></animate>
              <animate
                attributeName="fill"
                values="none;#8B5CF6;none"
                dur="1s"
                repeatCount="indefinite"></animate>
            </circle>
          </g>
        </svg>
        <p className="mt-4 text-purple-600 dark:text-purple-400 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
