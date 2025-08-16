// 📁 src/components/Toast.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
  return <ToastContainer position="bottom-right" autoClose={3000} />;
}