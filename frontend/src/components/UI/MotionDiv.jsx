import { motion } from "framer-motion";

const MotionDiv = ({children, y=20, delay=0.2, duration=0.8, className = "mt-8 sm:mx-auto sm:w-full sm:max-w-md",}) => {
    return(
        <motion.div
        className={className}
        initial={{ opacity: 0, y: y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration, delay: delay }}
      >{children}</motion.div>
    )
}

export default MotionDiv