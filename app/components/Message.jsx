'use client'
import { Typography, Box } from '@mui/material';

const Message = ({ username, message, isCurrentUser }) => {
  const dialogColor = isCurrentUser ? '#e2f3ff' : '#f0f0f0';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
      }}
    >
      <div style={{ marginLeft: '10px' }}>
        <Box
          component="div"
          sx={{
            backgroundColor: dialogColor,
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Typography variant="subtitle1" component="p">
            {username}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ whiteSpace: 'pre-line' }}
          >
            {message}
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Message
