import { ClipLoader, PulseLoader, ScaleLoader } from "react-spinners";

const LoadingSpinner = ({
  type = "clip",
  size = "medium",
  color = "blue",
  text = "Loading...",
  showText = true,
  className = "",
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 30;
      case "large":
        return 40;
      case "xl":
        return 50;
      default:
        return 30;
    }
  };

  const getColor = () => {
    switch (color) {
      case "blue":
        return "#3B82F6";
      case "purple":
        return "#8B5CF6";
      case "green":
        return "#10B981";
      case "red":
        return "#EF4444";
      case "gray":
        return "#6B7280";
      default:
        return "#3B82F6";
    }
  };

  const renderSpinner = () => {
    const spinnerSize = getSize();
    const spinnerColor = getColor();

    switch (type) {
      case "clip":
        return <ClipLoader color={spinnerColor} size={spinnerSize} />;
      case "pulse":
        return <PulseLoader color={spinnerColor} size={8} />;
      case "scale":
        return (
          <ScaleLoader color={spinnerColor} height={spinnerSize} width={4} />
        );
      default:
        return <ClipLoader color={spinnerColor} size={spinnerSize} />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="relative">
        {renderSpinner()}
        {type === "clip" && (
          <div className="absolute inset-0 rounded-full bg-blue-50/50 animate-pulse"></div>
        )}
      </div>
      {showText && text && (
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
