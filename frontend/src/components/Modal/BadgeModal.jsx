import { useState } from "react";
import "../../styles/Modal/BadgeModal.css";
import closeBtn from "../../assets/closeBtn.svg";

const BadgeModal = ({ closeBadgeModal, badgeData }) => {
  // Track whether we're currently closing (for the close animation)
  const [isClosing, setIsClosing] = useState(false);

  // This fires when the animation ends (open or close)
  const handleAnimationEnd = () => {
    // If we just finished the closing animation, unmount the modal
    if (isClosing) {
      closeBadgeModal();
    }
  };

  const handleCloseClick = () => {
    // Trigger the closing animation
    setIsClosing(true);
  };

  return (
    <div
      className={`badgeModal-container ${isClosing ? "closing" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="badgeModal-container-2">
        <div className="badge-header">
          <div className="badge-close-btn" onClick={handleCloseClick}>
            <img src={closeBtn} alt="close button" />
          </div>
        </div>
        <div className="badgeModal">
          <img src={badgeData.badge} alt={badgeData.name} />
          <h1>{badgeData.displayName}</h1>
          <p>{badgeData.criteria}</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;
