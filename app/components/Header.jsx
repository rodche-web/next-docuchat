'use client'
import {Typography,Toolbar,Box,AppBar} from '@mui/material';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DocuChat
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}