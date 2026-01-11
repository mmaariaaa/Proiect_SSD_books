import { shareProgress } from "../services/shareProgress";
import { useAuth } from "../context/AuthContext";

const ShareProgressButton = ({ item }) => {
  const { currentUser } = useAuth();

  const handleShare = async () => {
    await shareProgress({
      userId: currentUser.uid,
      username: currentUser.displayName,
      itemId: item.id,
      itemTitle: item.title,
      progress: item.progress
    });
  };

  return (
    <button onClick={handleShare}>
      Share Progress
    </button>
  );
};

export default ShareProgressButton;
