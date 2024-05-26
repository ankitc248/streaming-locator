import { motion } from "framer-motion";
const NetworkError = ({ values }) => {
  return (
    <motion.div className="empty-result stream-card network-error">
      <div className="title">
        <span className="special-icon"><img src="assets/media-icons/dead-tongue.svg" alt="network error" className="icon svg big-icon"/></span>
        {/* <h1>{values.code}</h1>
        <p>{values.message}</p> */}
        <span className="text">{values.message}</span>
      </div>
    </motion.div>
  );
};

export default NetworkError;
