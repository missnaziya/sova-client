const Loader = () => {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  };
  
  const styles = {
    loaderContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "5px solid rgba(0, 0, 0, 0.2)",
      borderTop: "5px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };
  
  // Add keyframe animation using JavaScript
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `@keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`,
    styleSheet.cssRules.length
  );
  
  export default Loader;
  