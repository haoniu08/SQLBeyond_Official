import "../../styles/Modal/LogoutModal.css";
import { useAuth } from "../Login/AuthContext";

const LogoutModal = ({ closeLogoutModal }) => {
  const auth = useAuth();

  const handleClick = (choice) => {
    if (!choice) {
      return closeLogoutModal();
    }

    auth.logout();
    return closeLogoutModal();
  };

  return (
    <div className="logoutModal-container">
      <div className="logoutModal-container-2">
        <div className="logoutModal">
          <h1>Are you sure you want to leave?</h1>
          <span className="logout-btns">
            <button onClick={() => handleClick(false)}>Stay</button>
            <button onClick={() => handleClick(true)}>Logout</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
