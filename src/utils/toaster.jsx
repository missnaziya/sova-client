import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const SuccessToaster = (message) => {
    return toast.success(message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
}

export const ErrorToaster = (message) => {
    return toast.error(message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
}