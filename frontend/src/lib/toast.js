import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Toast {
  static success(message, options = {}) {
    toast.success(message, {
      position: options.position || "top-right", 
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
      ...options, 
    });
  }

  static error(message, options = {}) {
    toast.error(message, {
      position: options.position || "top-right",
      autoClose: 3000,
      hideProgressBar:  false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
      ...options,
    });
  }

  static info(message, options = {}) {
    toast.info(message, {
      position: options.position || "top-right",
      autoClose:  3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
      ...options,
    });
  }

  static warning(message, options = {}) {
    toast.warning(message, {
      position: options.position || "top-right",
      autoClose: 3000,
      hideProgressBar:  false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
      ...options,
    });
  }
}

export default Toast;
