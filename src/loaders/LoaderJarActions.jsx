import ContentLoader from "react-content-loader";

const LoaderJarActions = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={40}
      viewBox="0 0 300 70"
      backgroundColor="#0a001e1a"
      foregroundColor="#ecebeb"
    >
      <circle cx="15%" cy="35" r="35" />
      <rect x="35%" y="20" rx="8" ry="18" width="60%" height="28" />
    </ContentLoader>
  );
};

export default LoaderJarActions;
