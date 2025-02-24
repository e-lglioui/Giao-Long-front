import { useNavigate } from 'react-router-dom';
import { CreateEventForm } from '../components/CreateEventForm';
import { useAuth } from '@/hooks/useAuth';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
 console.log("user in creat page",user)
  const handleSuccess = () => {
    navigate('/dashboard/events');
  };

  const handleClose = () => {
    navigate('/dashboard/events');
  };

  return (
    <div className="container mx-auto py-6">
      {user ? (
        <CreateEventForm 
          userId={user.id}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
} 